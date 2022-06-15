#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import sqlite3
from flask import Flask
from flask import request, render_template, url_for, redirect, flash
import traceback  
import email.message
import smtplib
import random
from bs4 import BeautifulSoup
import requests
import tempfile
import os


app = Flask(__name__)

PAGE_LIMIT = 10
BASE_URL = 'https://www.ptt.cc/bbs/movie/search'


def get_target_url(page, name):
    return (
        f'{BASE_URL}?page={page}&q={name}'
        if page and name 
        else BASE_URL
    )

def crawl_article_titles(movie_name):
    titles = []
    for page in range(1, PAGE_LIMIT + 1):
        html2 = requests.get(get_target_url(page, movie_name))
        sp2 = BeautifulSoup(html2.content, "html.parser")
        for entry in sp2.select('.r-ent'):
            titles.append(entry.select('.title')[0].text)
    return titles

def get_target_tags(titles = []):
    return [
        trim_title(title)
        for title in titles
        if is_title_valid(title)
    ]

def is_title_valid(title = ''):
    return (
        '雷' in title
        and '[' in title
        and ']' in title
        and 'Re' not in title
    )

def trim_title(title = ''):
    return (
        title
        .split(']', 1)[0]
        .split('[', 1)[1]
        .replace(' ', '')
    )

def is_tag_good(tag = ''):
    return ('好' in tag)

def is_tag_bad(tag = ''):
    return (('爛' in tag) or ('負' in tag))

def is_tag_ordinary(tag = ''):
    return (
        '普' in tag
        and '好' not in tag
        and '爛' not in tag
        and '負' not in tag
    )

def calculate_tags(tags = []):
    good_count = 0
    ordinary_count = 0
    bad_count = 0

    for tag in tags:
        if is_tag_good(tag):
            good_count += 1
        elif is_tag_bad(tag):
            bad_count += 1
        elif is_tag_ordinary(tag):
            ordinary_count += 1
    total_count = good_count + ordinary_count + bad_count
    return (good_count, ordinary_count, bad_count, total_count)

def get_result_msbg(good_count, ordinary_count, bad_count, total_count):
    mskg = "查無資料"

    if total_count > 0:
        good_percent = (good_count / total_count) * 100
        ordinary_percent = (ordinary_count / total_count) * 100
        bad_percent = (bad_count / total_count) * 100
        
        mskg = get_msag_content(
            total_count,
            good_count,
            good_percent,
            ordinary_count,
            ordinary_percent,
            bad_count,
            bad_percent,
        )
    return mskg

def get_msag_content(
    total_count,
    good_count,
    good_percent,
    ordinary_count,
    ordinary_percent,
    bad_count,
    bad_percent,
):
    return (f"評價總共有{total_count}篇\n好評有{good_count}篇/好評率為{good_percent:.2f}\n普評有{ordinary_count}篇/普評率為{ordinary_percent:.2f}\n負評有{bad_count}篇/負評率為{bad_percent:.2f}\n")

def movie(movie_name):
    titles = crawl_article_titles(movie_name)
    title_tags = get_target_tags(titles)
    (
        good_count,
        ordinary_count,
        bad_count,
        total_count,
    ) = calculate_tags(title_tags)
    a=get_result_msbg(good_count, ordinary_count, bad_count, total_count)
    return a

def scrape(foodi):
    url="https://ifoodie.tw/explore/"+foodi+"/list?sortby=popular&opening=true"
    html =requests.get(url)
    sp = BeautifulSoup(html.content, "html.parser")
    cards = sp.find_all('div', {'class': 'jsx-3440511973 restaurant-info'})
    content = ""
    for card in cards:
        title = card.find("a", {"class": "jsx-3440511973 title-text"}).getText()
        stars = card.find("div", {"class": "jsx-1207467136 text"}).getText()
        address = card.find("div", {"class": "jsx-3440511973 address-row"}).getText()
        content += f"{title} \n{stars}顆星 \n{address} \n\n"
    return content

@app.route('/serch1', methods=['GET'])
def score():
    movies=request.args.get('user')
    movies=movie(movies)
    print(movies)
    conn = sqlite3.connect('test.db')
    sqlstr="insert into data(name,dataall) values('{}','{}')".format(request.args.get('user'),movies)
    cursor=conn.execute(sqlstr)
    conn.commit()
    sqlstr ="SELECT name,dataall FROM data"
    cursor=conn.execute(sqlstr)
    scoredata=cursor.fetchall()
    conn.commit()
    return render_template('login.html', scores=scoredata)

@app.route('/serch2', methods=['GET'])
def serch2():
    food=request.args.get('user')
    food=scrape(food)
    print(food)
    conn = sqlite3.connect('test.db')
    sqlstr="insert into data(name,dataall) values('{}','{}')".format(request.args.get('user'),food)
    cursor=conn.execute(sqlstr)
    conn.commit()
    sqlstr ="SELECT name,dataall FROM data"
    cursor=conn.execute(sqlstr)
    scoredata=cursor.fetchall()
    conn.commit()
    return render_template('login.html', scores=scoredata)
    
    



@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/about')
def homeabout():
    return render_template('about.html')

@app.route('/news')
def homenews():
    return render_template('news.html')

@app.route('/loginweb')
def loginweb():
    return render_template('login.html')

@app.route('/portfolio')
def homeportfolio():
    return render_template('portfolio.html')

@app.route('/email')
def emailcent():
    return render_template('email.html')



@app.route('/emailcheck')
def emailchecker():
    ck=""
    conn = sqlite3.connect('test.db')
    sqlstr ="SELECT name,dataall FROM data"
    cursor=conn.execute(sqlstr)
    scoredata=cursor.fetchall()
    for score in scoredata:
        ck+=score[0]+score[1]
    msgg=email.message.EmailMessage()
    msgg["From"]="zxc110810@gmail.com"
    msgg["To"]=request.args.get('email')
    msgg["Subject"]="搜尋結果"
    msgg.set_content("搜尋結果:'"+ck+"'")
    server=smtplib.SMTP_SSL("smtp.gmail.com",465)
    server.login("zxc110810@gmail.com","your password")
    server.send_message(msgg)
    server.close()
    sqlstr ="DELETE FROM data"
    cursor=conn.execute(sqlstr)
    conn.commit()
    return redirect(url_for('homepage'))





if __name__ == '__main__':
    app.run()


# In[ ]:





# In[ ]:





# In[ ]:




