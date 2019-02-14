from flask import Flask, render_template, request, redirect, url_for, json, jsonify
from flask import Flask
# from flaskext.mysql import MySQL
import random
import uuid
import math
import time
import numpy as np
import mysql.connector
from scipy import linalg as la 
from flask_cors import CORS
from mysql.connector import connection
from flaskext.mysql import MySQL


fname = ''   #added to make possible registration without database
lname = ''
email = ''
password = ''


app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
mysql = MySQL()

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'npm'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'accounts'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
#app.config['MYSQL_CURSORCLASS'] = 'DictCursor'


mysql.init_app(app)


#Calculates U,S and V (Components of svd of a matrix.
def SVD(a):

	#Calculate traspose of the matrix(A').
	b=a.transpose()
	#print b

	#Get A*A' and A'*A.
	ab=np.dot(a,b)
	ba=np.dot(b,a)

	#calculate eigen valus and eigen vectors for a*a' and retain only k princliple values and vectors. sort them in decsending order.
	ab_e,u=la.eigh(ab,eigvals=(len(ab)-500,len(ab)-1),eigvals_only=False)

	idx=ab_e.argsort()[::-1]
	ab_e=ab_e[idx]
	u=u[:,idx]
	for i in range(len(u)):
		for j in range(len(u[0])):
			u[i][j]=round(u[i][j],2)
	#print ab_e,u,len(u),len(u[0])
	
	
	#calculate eigen valus and eigen vectors for a*a' and retain only k princliple values and vectors. sort them in decsending order.
	ba_e,v=la.eigh(ba,eigvals=(len(ba)-500,len(ba)-1),eigvals_only=False)
	idx=ba_e.argsort()[::-1]
	v=v[:,idx]
	for i in range(len(v)):
		for j in range(len(v[0])):
			v[i][j]=round(v[i][j],2)

	#print len(v),len(v[0])

	#the matric s in svd is squre root of eigen values of a*a' or a'*a(both are equal).
	s=[round(math.sqrt(i),2) for i in ba_e]
	
	return u,s,v


def sample_recommendation(uid):
	f1=open('u.data')
	users={}
	movies={}
	index1=0
	index2=0
	a=np.array([[0 for row in range(1983)] for col in range(944)])
	#print len(a),len(a[0])
	f1.readline()
	
	#reading the file content into a matrix.
	for line in f1:
		line=line.strip()
		line=line.split('\t')
		if line[1] not in movies and line[0] not in users:
			movies[line[1]]=index1
			index1+=1
			users[line[0]]=index2
			index2+=1
			a[users[line[0]]][movies[line[1]]]=float(line[2])
		elif line[1] in movies and line[0] not in users:
			users[line[0]]=index2
			index2+=1
			a[users[line[0]]][movies[line[1]]]=float(line[2])
		elif line[0] in users and line[1] not in movies:
			movies[line[1]]=index1
			index1+=1
			a[users[line[0]]][movies[line[1]]]=float(line[2])
	'''for i in a:
		count=0
		for j in i:
			if j!=0:
				count+=1'''
	
	#get svd of the matrix.
	U,S,V=SVD(a)

	#also we're gonna need a' for reconstruction.
	Vt=V.transpose()

	#Now take a user_id and reconstruct the rating matrix using the Decomposition.
	if int(uid)>943 or int(uid)<1:
		print ("Please enter valid UID")
	row=a[users[uid]]

	#To get the movies for recomendation, we compute user_row*V*Vt.
	#Then recomend movies with highest values.
	j=np.dot(row,V)
	uid_rating=np.dot(j,Vt)

	#Sorting the user_rating row.
	idx=uid_rating.argsort()[::-1]
	
	uid_rating=uid_rating[idx]
	movie=idx[0:20]

	#Check if the user has already seen the movie, if not then recomend it.(Max 5 movies)
	count=0
	val=[]
	for f in movie:
		for key in movies:
			if movies[key]==f:
				if not a[users[uid]][movies[key]]>0:
					if count<5:
						val.append(key)

						count+=1
	return val

@app.route('/title', methods=['POST'])
def title():
    #error = None
    #x = str(request.form['id'])
    #s = []
    #s = sample_recommendation(x)
    #return json.dumps({'success':True, 'movie': s}), 200, {'ContentType':'application/json'}
    #return render_template('login.html', error=error)
    error = None
    x = str(request.form['user_id'])
    # data = []
    # s = []
    # i = 1 
    # s = sample_recommendation(x)
    # cur = mysql.connect().cursor()
    # for i in range(1, len(s)):
    #         s1 = cur.execute("SELECT imdb_id FROM movies WHERE id = %s", s[i])
    #         if s1>0:
    #                 s1 = cur.fetchone()
    #                 data.append(s1)
    # return json.dumps({'success':True, 'imdb_id': data}), 200, {'ContentType':'application/json'}
    #return render_template('login.html', error=error)
    data = ['http://www.omdbapi.com/?i=tt6823368&apikey=4b6c650b',
            'http://www.omdbapi.com/?i=tt1477834&apikey=4b6c650b',
            'http://www.omdbapi.com/?i=tt7905466&apikey=4b6c650b',
            'http://www.omdbapi.com/?i=tt6966692&apikey=4b6c650b']
   
    return json.dumps({'success':True, 'link': data}), 200, {'ContentType':'application/json'}


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d
    
@app.route('/rating', methods=['POST'])
def rating():
        requestData = request.get_json()
        id_user = requestData["idu"]
        id_film = requestData["idf"]
        rating = requestData["rating"]
        ts = str(int(time.time()))
        with open("u.data", "a") as att_file:
                att_file.write(id_user + "\t" + id_film + "\t" + rating + "\t" + ts + "\n")
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        
@app.route('/')
def get():
    cur = mysql.connect().cursor()
    sql = 'select * from accounts.users'
    cur.execute(sql)
    results = cur.fetchall()
    return jsonify (results)


@app.route('/login', methods=['POST'])
def login():
    requestData = request.get_json()
    loginEmail = requestData["email"]
    loginPassword = requestData["password"]
    # cur = mysql.connect().cursor()
    # resultValue = cur.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email,password))
    # if resultValue == 1:    
    #     data = cur.fetchone()
    #     return json.dumps({'success':True, 'email': data[3],'id': data[0],'firstName': data[1]}), 200, {'ContentType':'application/json'} 

    # else:
    #     return json.dumps({'success':False}), 200, {'ContentType':'application/json'}
    # cur.close()
    if (loginEmail == 'user' and loginPassword == 'user') or (loginEmail == email and loginPassword == password):
        return json.dumps({'success':True, 'email': 'user','id': 1,'firstName': 'user'}), 200, {'ContentType':'application/json'} 
    else:
        return json.dumps({'success':False}), 200, {'ContentType':'application/json'}


@app.route('/search', methods=['POST'])
def search():
    requestData = request.get_json()
    title = str(request.form['title'])
    title2 = 'venom'
    title3 = 'the'
    data = ['http://www.omdbapi.com/?i=tt1270797&apikey=4b6c650b']
    
    data2 = ['http://www.omdbapi.com/?i=tt0111161&apikey=4b6c650b',
             'http://www.omdbapi.com/?i=tt0068646&apikey=4b6c650b',
             'http://www.omdbapi.com/?i=tt0468569&apikey=4b6c650b',
             'http://www.omdbapi.com/?i=tt0167260&apikey=4b6c650b']

    # cur = mysql.connect().cursor()
    # resultValue = cur.execute("SELECT imdb_id FROM movies WHERE title LIKE (title)")
    # if resultValue >= 1:
            # data = cur.fetchall()
    if title == title3:
        return json.dumps({'success':True, 'link': data2}), 200, {'ContentType':'application/json'} 
    else:
        if title == title2:
            return json.dumps({'success':True, 'link': data}), 200, {'ContentType':'application/json'} 
        else:
             return json.dumps({'success':False}), 400, {'ContentType':'application/json'}


    # cur.close()
    
        
@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST': 
        requestData = request.get_json()
        global fname 
        global lname 
        global email 
        global password 
        fname = requestData["firstName"]
        laname = requestData["lastName"]
        email = requestData["email"]
        password = requestData["password"]
        # cur = mysql.connect().cursor()
        # resultValue = cur.execute("SELECT * FROM users WHERE email=%s", (email))
        # if resultValue < 1:    
        #     cur.execute("INSERT INTO users(first_name, last_name, email, password, hash, active) VALUES (%s, %s, %s, %s, 'a', 1)", (fname, lname, email, password))
        #     #cur.execute("INSERT INTO users(id, first_name, last_name, email, password, hash, active) VALUES (4, 'c', 'c', 'ads', 'a','a', 1)")
        #     return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
        # else:
        #     return json.dumps({'success':False}), 200, {'ContentType':'application/json'}
        # cur.close()
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 





if __name__ == '__main__':
  app.run(debug = True)