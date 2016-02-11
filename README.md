#### Keywords: MongoDB , Node, Express, Angular, Bootstrap, REST API, Passport, User authentication. 

# ka-yak
## An anonymous message board for the Ottawa-Gatineau area
Ka-yak is a Yik-yak style confessions board that allows users to create accounts and "like"
other posts made by them and other users. 
#### Mechanics
Ka-yak's back end centres around a REST API built with Node and Express. 

It has two main functions:
- Allow the user to register and/or sign in
- Retrieve posts from MongoDB and update post score


Once the post data is forwarded to an Angular and Bootstrap front end, the user has the option to Register or Login. 
If they do, they're allowed to "like" and create content. 

For this project, I used the passport middleware to authenticate users and take care of login. 







