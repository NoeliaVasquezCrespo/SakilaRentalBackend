/*--------------------------Query 1------------------*/
select * from actor;

/*--------------------------Query 2------------------*/
SELECT * FROM actor WHERE actor_id = 1;

/*--------------------------Query 3------------------*/
SELECT f.film_id, f.title,f.description, CONCAT(a.first_name, ' ', a.last_name) as full_name 
FROM film_actor fa 
LEFT JOIN film f ON ( fa.film_id = f.film_id)
LEFT JOIN actor a ON ( fa.actor_id = a.actor_id)
 WHERE a.first_name ="penelope" 
 AND a.last_name ="guiness";

/*--------------------------Query 4------------------*/
SELECT f.film_id, f.title,f.description, CONCAT(a.first_name, ' ', a.last_name) as full_name 
FROM film_actor fa 
LEFT JOIN film f ON ( fa.film_id = f.film_id)
LEFT JOIN actor a ON ( fa.actor_id = a.actor_id) 
WHERE a.first_name LIKE "penelope";

/*--------------------------Query 5------------------*/
select ad.address_id, ad.address, ad.district, ad.phone, CONCAT(cu.first_name, ' ', cu.last_name) as customer
from address ad
left join customer cu on (cu.address_id = ad.address_id)
where cu.customer_id = 1;

/*--------------------------Query 6------------------*/
update address set address = "Bourbon Street" , 
address2 = "Wall Street", 
district = "Delaware", 
phone = "123456789" 
where address_id =1;

/*--------------------------Query 7------------------*/
insert into address (address, address2, district, city_id, postal_code,phone,location,last_update) 
values ("Dirección 1","Direccion 2","Distrito",2,"123456",987654,ST_GeomFromText('POINT(40.71727401 -74.00898606)', 0),CURRENT_TIMESTAMP);

/*--------------------------Query 8------------------*/
select  ad.address_id, ad.address, ad.district, ci.city, co.country
from country co
left join city ci on (ci.country_id = co.country_id)
left join address ad on (ad.city_id = ci.city_id)
left join store s on (s.address_id = ad.address_id)
where s.store_id = "1"
or s.store_id = "2";

/*--------------------------Query 9------------------*/
select * from category;

/*--------------------------Query 10-----------------*/
SELECT f.film_id, f.title,f.description,c.name
FROM film_category fc 
LEFT JOIN film f ON ( fc.film_id = f.film_id)
LEFT JOIN category c ON ( fc.category_id = c.category_id) 
WHERE c.category_id = 1;

/*--------------------------Query 11-----------------*/
select ci.city_id, ci.city
from city ci
left join address ad on (ad.city_id = ci.city_id)
left join store s on (s.address_id = ad.address_id)
where s.store_id = "1"
or s.store_id = "2";

/*--------------------------Query 12-----------------*/
SELECT c.city_id, c.city, co.country 
FROM city c 
LEFT JOIN country co ON ( co.country_id = c.country_id) 
WHERE country = "Canada";

/*--------------------------Query 13-----------------*/
select co.country_id, co.country
from country co
left join city ci on (ci.country_id = co.country_id)
left join address ad on (ad.city_id = ci.city_id)
left join store s on (s.address_id = ad.address_id)
where s.store_id = "1"
or s.store_id = "2";

/*--------------------------Query 14-----------------*/
SELECT f.film_id, f.title, f.description, COUNT(*) as avaliability
FROM film f
LEFT JOIN inventory i ON (f.film_id = i.film_id)
LEFT JOIN store s ON (s.store_id = i.store_id)
LEFT JOIN address ad ON (s.address_id = ad.address_id)
LEFT JOIN city ci ON (ad.city_id = ci.city_id)
LEFT JOIN country c ON (ci.country_id = c.country_id)
WHERE c.country_id = 8
GROUP BY f.title
HAVING COUNT(*) > 1
ORDER BY f.title;

/*--------------------------Query 15-----------------*/
select cu.customer_id, s.store_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, cu.email, ad.address,cu.active, cu.last_update
from customer cu
left join store s on (s.store_id = cu.store_id)
LEFT JOIN address ad ON (ad.address_id = cu.address_id);

/*--------------------------Query 16-----------------*/
select cu.customer_id, s.store_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, cu.email, ad.address,cu.active, cu.last_update
from customer cu
left join store s on (s.store_id = cu.store_id)
LEFT JOIN address ad ON (ad.address_id = cu.address_id)
WHERE cu.customer_id =1;

/*--------------------------Query 17-----------------*/
update customer set first_name = "MIKE", 
last_name ="HANKS", 
email = "mikehanks@gmail.com", 
active = 1 
where customer_id =1;

/*--------------------------Query 18-----------------*/
insert into customer (store_id, first_name, last_name, email, address_id, active, create_date, last_update) 
values (1,"Taylor","Rodriguez","taylorrodriguez@gmail.com",1,1,NOW(),CURRENT_TIMESTAMP);
 
/*--------------------------Query 19-----------------*/
select * from film;

/*--------------------------Query 20------------------*/
SELECT f.film_id, f.title, f.description,f.release_year, l.name as language , f.length, f.rating, f.special_features, f.last_update 
FROM film f
LEFT JOIN language l ON ( f.language_id = l.language_id) 
LEFT JOIN language ol ON ( f.original_language_id = ol.language_id)
WHERE film_id = 1;

/*--------------------------Query 21------------------*/
SELECT film_id, title, description, release_year 
FROM film 
WHERE title ="Academy dinosaur";
   
/*--------------------------Query 22------------------*/
insert into film (title, description,release_year, language_id, original_language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, last_update) 
values ("Dear Evan Hansen",
"Evan Hansen is a high school senior with social anxiety disorder. Evan embarks on a journey of self-discovery and acceptance following the suicide of a classmate",
2021,1,NULL,3,4.99,130,20.99,"PG-13","Trailers,Deleted Scenes",CURRENT_TIMESTAMP);
   
/*--------------------------Query 23------------------*/
SELECT f.film_id, f.title, f.description,f.release_year, l.name as language, f.rental_rate,
f.length, f.rating, f.special_features, f.last_update 
FROM film f
LEFT JOIN language l ON ( f.language_id = l.language_id) 
LEFT JOIN language ol ON ( f.original_language_id = ol.language_id)
WHERE f.rental_rate=0.99;

/*--------------------------Query 24------------------*/
select fa.actor_id, CONCAT(a.first_name, ' ', a.last_name)as actor, fa.film_id, f.title
from film_actor fa
left join film f on (f.film_id = fa.film_id)
left join actor a on (a.actor_id = fa.actor_id);

/*--------------------------Query 25------------------*/
insert into film_actor (film_id, actor_id, last_update) 
values (520,250, CURRENT_TIMESTAMP);

/*--------------------------Query 26------------------*/
SELECT i.inventory_id, f.title, COUNT(*) as Total
FROM film f
LEFT JOIN inventory i ON (f.film_id = i.film_id)
LEFT JOIN store s ON (s.store_id = i.store_id)
LEFT JOIN address ad ON (s.address_id = ad.address_id)
LEFT JOIN city ci ON (ad.city_id = ci.city_id)
LEFT JOIN country c ON (ci.country_id = c.country_id)
GROUP BY f.title
HAVING COUNT(*) > 1
ORDER BY f.title;

/*--------------------------Query 27------------------*/
SELECT i.inventory_id, f.title, s.store_id, COUNT(*) as Total
FROM film f
LEFT JOIN inventory i ON (f.film_id = i.film_id)
LEFT JOIN store s ON (s.store_id = i.store_id)
LEFT JOIN address ad ON (s.address_id = ad.address_id)
LEFT JOIN city ci ON (ad.city_id = ci.city_id)
LEFT JOIN country c ON (ci.country_id = c.country_id)
WHERE s.store_id = 1
GROUP BY f.title
HAVING COUNT(*) > 1
ORDER BY f.title;

/*--------------------------Query 28------------------*/
SELECT i.inventory_id, f.film_id, f.title, s.store_id
FROM film f
LEFT JOIN inventory i ON (f.film_id = i.film_id)
LEFT JOIN store s ON (s.store_id = i.store_id)
LEFT JOIN address ad ON (s.address_id = ad.address_id)
LEFT JOIN city ci ON (ad.city_id = ci.city_id)
LEFT JOIN country c ON (ci.country_id = c.country_id)
WHERE inventory_id = 1;

/*--------------------------Query 29------------------*/
insert into inventory (film_id, store_id, last_update) 
values (1,1, CURRENT_TIMESTAMP);

/*--------------------------Query 30------------------*/
select * from language;

/*--------------------------Query 31------------------*/
select p.payment_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, CONCAT(s.first_name, ' ', s.last_name)as staff,r.rental_id, i.inventory_id,f.title, p.amount, p.payment_date,p.last_update
from payment p
left join rental r on (r.rental_id = p.rental_id)
left join inventory i on (r.inventory_id = i.inventory_id)
LEFT JOIN film f ON (f.film_id = i.film_id)
left join customer cu on (cu.customer_id = p.customer_id)
left join staff s on (s.staff_id = p.staff_id);

/*--------------------------Query 32------------------*/
Select p.payment_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, CONCAT(s.first_name, ' ', s.last_name)as staff,r.rental_id, i.inventory_id,f.title, p.amount, p.payment_date,p.last_update 
from payment p 
left join rental r on (r.rental_id = p.rental_id) 
left join inventory i on (r.inventory_id = i.inventory_id) 
LEFT JOIN film f ON (f.film_id = i.film_id) 
left join customer cu on (cu.customer_id = p.customer_id) 
left join staff s on (s.staff_id = p.staff_id)  
where cu.first_name = "barbara" 
AND cu.last_name = "jones";

/*--------------------------Query 33------------------*/
select p.payment_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, CONCAT(s.first_name, ' ', s.last_name)as staff,r.rental_id, i.inventory_id,f.title, p.amount, p.payment_date,p.last_update
from payment p
left join rental r on (r.rental_id = p.rental_id)
left join inventory i on (r.inventory_id = i.inventory_id)
LEFT JOIN film f ON (f.film_id = i.film_id)
left join customer cu on (cu.customer_id = p.customer_id)
left join staff s on (s.staff_id = p.staff_id)
WHERE p.payment_id =1;

/*--------------------------Query 34------------------*/
insert into payment (customer_id, staff_id, rental_id, amount, payment_date,last_update) 
values (1,1,2,4.89,NOW(),CURRENT_TIMESTAMP);
    
/*--------------------------Query 35------------------*/
select r.rental_id, r.rental_date, f.title, CONCAT(cu.first_name, ' ', cu.last_name)as customer,r.return_date, CONCAT(s.first_name, ' ', s.last_name)as staff, r.last_update
from rental r
left join inventory i on (r.inventory_id = i.inventory_id)
LEFT JOIN film f ON (f.film_id = i.film_id)
left join customer cu on (cu.customer_id = r.customer_id)
left join staff s on (s.staff_id = r.staff_id);

/*--------------------------Query 36------------------*/
select r.rental_id, r.rental_date, f.title, CONCAT(cu.first_name, ' ', cu.last_name)as customer,r.return_date, CONCAT(s.first_name, ' ', s.last_name)as staff, r.last_update
from rental r
left join inventory i on (r.inventory_id = i.inventory_id)
LEFT JOIN film f ON (f.film_id = i.film_id)
left join customer cu on (cu.customer_id = r.customer_id)
left join staff s on (s.staff_id = r.staff_id)
WHERE rental_id = 1;

/*--------------------------Query 37------------------*/
select r.rental_id, r.rental_date, f.title, CONCAT(cu.first_name, ' ', cu.last_name)as customer,r.return_date, CONCAT(s.first_name, ' ', s.last_name)as staff, r.last_update 
from rental r 
left join inventory i on (r.inventory_id = i.inventory_id) 
LEFT JOIN film f ON (f.film_id = i.film_id) 
left join customer cu on (cu.customer_id = r.customer_id) 
left join staff s on (s.staff_id = r.staff_id) 
where cu.first_name = "Mary"
AND cu.last_name = "Smith";
    
/*--------------------------Query 38------------------*/
insert into rental (rental_date, inventory_id, customer_id, return_date, staff_id,last_update) 
values ("2021-10-15 23:24:09",2,1,"2005-05-26 22:04:30",2,CURRENT_TIMESTAMP);

/*--------------------------Query 39------------------*/
select s.staff_id, CONCAT(s.first_name, ' ', s.last_name)as staff,ad.address, s.email, st.store_id, s.active, s.username, s.last_update
from staff s
left join address ad on (ad.address_id = s.address_id)
left join store st on (st.store_id = s.store_id);

/*--------------------------Query 40------------------*/
select s.staff_id, CONCAT(s.first_name, ' ', s.last_name)as staff,ad.address, s.email, st.store_id, s.active, s.username, s.last_update 
from staff s 
left join address ad on (ad.address_id = s.address_id) 
left join store st on (st.store_id = s.store_id)  
where s.first_name = "Mike"
AND s.last_name = "Hillyer";

/*--------------------------Query 41------------------*/
select s.staff_id, CONCAT(s.first_name, ' ', s.last_name)as staff,ad.address, s.email, st.store_id, s.active, s.username, s.last_update
from staff s
left join address ad on (ad.address_id = s.address_id)
left join store st on (st.store_id = s.store_id)
WHERE s.staff_id = 1;

/*--------------------------Query 42------------------*/
insert into staff (first_name, last_name, address_id, picture, email, store_id, active, username, password,last_update) 
values ("Tyler","Evans",5,NULL,"tylerevans@gmail.com",2,'1',"tyler1234","1234",CURRENT_TIMESTAMP);
        
/*--------------------------Query 43------------------*/
update staff set first_name = "Tyler", 
last_name ="Evan", 
email = "tylerevans@gmail.com", 
active = 1 
where staff_id = 3;

/*--------------------------Query 44------------------*/
SELECT st.store_id, CONCAT(s.first_name, ' ', s.last_name)as staff, ad.address, st.last_update
FROM store st 
left join staff s on (st.manager_staff_id = s.staff_id)
LEFT JOIN address ad ON (ad.address_id = st.address_id);

