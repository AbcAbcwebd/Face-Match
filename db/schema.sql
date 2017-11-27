CREATE DATABASE face_match_db;
USE face_match_db;

create table users (
	id int auto_increment,
    name varchar(30) not null,
    primary key (id)
);

select * from users;