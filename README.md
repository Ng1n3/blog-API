 # Blog-API
 A blog API that provides end points for users to perform CRUD operations with a blog. Live [Here](https://simple-note-icoj.onrender.com/)

## TODO
* Create a user
* update user info
* connect user to a database (MongoDB)
* Use JWT as an Authentication and Authorization strategy for the user
* Allow only the user to perform admin level operations which includes; updating and deleting a blog
* build a database Schema for the user and the blog
* Create a relationship between the user and the Blog API
* Create features like read counts and reading time on a blog
* Use an ERD tool to show the database Schema and relationshipsbetween the database and also the User.

## Installation
Use the package manager [npm](https://www.npmjs.com/);
```javascript
npm install
```
## Routes End-Points
### Create User
```
{  
    method: POST,  
    url: "https://simple-note-icoj.onrender.com/signup,  
    required-Fields: ['first_name', 'last_name', 'email', 'password']

}  
```

### Get all Blogs
```
{  

    method: GET,  
    url: "https://simple-note-icoj.onrender.com/,  

}
```  
### login User
After loggin in, your JWT token will be generated for you which is only valid ofr 1hr
```
{  
    method: POST,  
    url: "https://simple-note-icoj.onrender.com/login,  
    required-Fields: ['email', 'password']

}  
```
### Create a Blog
```
{  
    method: POST,  
    url: "https://simple-note-icoj.onrender.com/blogs,  
    required-Fields: ['title', 'description', 'tags', 'body'].

}  
```
### Get a specific Blogs only
```
{  
    method: GET,
    url: "https://simple-note-icoj.onrender.com/:blogId,

}  
```
### Update Blog
```
{  
    method: PATCH,  
    url: "https://simple-note-icoj.onrender.com/blogs/:blogId,  
    required-Fields: ['title', 'description', 'tags', 'body'].

}  
```
### delete User
```
{  
    method: DELETE,  
    url: "https://simple-note-icoj.onrender.com/blogs/:blogId,

}  
```

### get users blog
```
{  
    method: GET,  
    url: "https://simple-note-icoj.onrender.com/blogs/myblogs,

}  
```

## NOTE
* JWT is required for all signed in operations, make sure to copy your token generated when you signed up or logged in, put it in the Header, then you are good to go. Your log in state is valid for only 1hour.
* here is a link to my database [schema](https://drawsql.app/teams/3n41n3/diagrams/memories)