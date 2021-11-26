var express = require("express");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var app = express();

//-----------------CONEXIÓN A LA BASE DE DATOS---------------

var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "sakila"
});

conn.connect(
    function (err) { 
        if (err) {
            console.log("Error: no pudo conectarse a la base de datos", err);
            throw err;
        }
        
        console.log("Conectado a la Base de Datos correctamente");
    }
);

app.listen(3000, () => {
    console.log("\nServidor HTTP funcionando correctamente");
});



/*------------------ ACTOR ---------------------*/

//1. Obtener la lista de todos lo actores
app.get('/actor',jsonParser,(req,res)=>{
    let qr = `select * from actor`;
    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'All actors data',
                data: result
            });
         }
    });
});

//2. Obtener datos de un actor
app.get('/actors/:id', (req, res) => {
    const { id } = req.params; 
    let qr = 'SELECT * FROM actor WHERE actor_id = ?';
    conn.query(qr, [id], (err, rows, fields) => {
      if (!err) {
        res.json(rows[0]);
      } else {
        console.log(err);
      }
    });
});

//3. Obtener películas donde actuó un actor (nombre y apellido)
app.get('/actor/:name/:last', (req, res) => {
    const { name } = req.params;
    const { last } = req.params; 

    let qr = "SELECT f.film_id, f.title,f.description, CONCAT(a.first_name, ' ', a.last_name) as full_name FROM film_actor fa LEFT JOIN film f ON ( fa.film_id = f.film_id)LEFT JOIN actor a ON ( fa.actor_id = a.actor_id) WHERE a.first_name LIKE '%" + name + "%' AND a.last_name LIKE '%" + last + "%'";
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});

//4. Obtener películas donde actuó un actor (nombre)
app.get('/actor/:first', (req, res) => {
    const { first } = req.params;

    let qr = "SELECT f.film_id, f.title,f.description, CONCAT(a.first_name, ' ', a.last_name) as full_name FROM film_actor fa LEFT JOIN film f ON ( fa.film_id = f.film_id)LEFT JOIN actor a ON ( fa.actor_id = a.actor_id) WHERE a.first_name LIKE '%" + first + "%'";
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});


/*------------------ ADDRESS ---------------------*/

//5. Obtener la dirección de un cliente

app.get('/address/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `select ad.address_id, ad.address, ad.district, ad.phone, CONCAT(cu.first_name, ' ', cu.last_name)
                as customer
                from address ad
                left join customer cu on (cu.address_id = ad.address_id)
                where cu.customer_id =${gID}`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Address information',
                data: result
            });
        }
    });
});

//6. Modificar la dirección de un cliente
app.put('/address/:id',jsonParser,(req,res)=>{

    console.log(req.body,'updatedata');
    
    let gID = req.params.id;
    let address = req.body.address;
    let address2 = req.body.address2;
    let district = req.body.district;
    let phone = req.body.phone;

  let qr = `update address set address = '${address}', address2 = '${address2}', district ='${district}', phone = '${phone}' where address_id =${gID}`;

        conn.query(qr,(err,result) => {
            if(err){
                console.log(err,'err')
            }
            res.send({
                message:'Dirección modificada',
                
            });
        });

});

//7.  Agregar dirección
app.post('/address',jsonParser,(req,res)=>{

    console.log(req.body,'createAddress');
    
    let address = req.body.address;
    let address2 = req.body.address2;
    let district = req.body.district;
    let city_id = req.body.city_id;
    let postal_code = req.body.postal_code;
    let phone = req.body.phone;

    let qr = `insert into address (address, address2, district, city_id, postal_code,phone,location,last_update) 
                values ('${address}','${address2}','${district}','${city_id}','${postal_code}','${phone}',ST_GeomFromText('POINT(40.71727401 -74.00898606)', 0),CURRENT_TIMESTAMP)`;
        conn.query(qr,(err,result) => {
          if(err){
            console.log(err)
          }
          console.log(result,`result`);
          res.send({
            message:'data inserted',
            
        });  
    });   
    
});

//8. Direcciones de las tiendas
app.get('/address',jsonParser,(req,res)=>{
    let qr = `select  ad.address_id, ad.address, ad.district, ci.city, co.country
                from country co
                left join city ci on (ci.country_id = co.country_id)
                left join address ad on (ad.city_id = ci.city_id)
                left join store s on (s.address_id = ad.address_id)
                where s.store_id = "1"
                or s.store_id = "2"`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'All stores data',
                data: result
            });
        }
    });
});


/*------------------ CATEGORY ---------------------*/

//9. Obtener todas categorias
app.get('/category',jsonParser,(req,res)=>{
    let qr = 'select * from category';

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'All category data',
                data: result
            });
        }
    });
});

//10. Obtener lista de películas que tienen esa categoría
app.get('/category/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;

    let qr = `SELECT f.film_id, f.title,f.description,c.name
                FROM film_category fc 
                LEFT JOIN film f ON ( fc.film_id = f.film_id)
                LEFT JOIN category c ON ( fc.category_id = c.category_id) 
                WHERE c.category_id = ${gID}`;
    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Films with category',
                data: result
            });
        }
    });
});

/*------------------ CITY ---------------------*/

//11. Obtener las ciudades donde se encuentan las tiendas
app.get('/city',jsonParser,(req,res)=>{
    let qr = `select ci.city_id, ci.city
                from city ci
                left join address ad on (ad.city_id = ci.city_id)
                left join store s on (s.address_id = ad.address_id)
                where s.store_id = "1"
                or s.store_id = "2"`;
    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'All cities data',
                data: result
            });
         }
    });
});

//12. Obtener ciudades de los países donde se encuentra las tiendas
app.get('/city/:name', (req, res) => {
    const { name } = req.params;

    let qr = "SELECT c.city_id, c.city, co.country FROM city c LEFT JOIN country co ON ( co.country_id = c.country_id) WHERE country LIKE '%" + name + "%'";
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});


/*------------------ COUNTRY ---------------------*/

//13. Obtener los países donde se encuentan las tiendas
app.get('/country',jsonParser,(req,res)=>{
    let qr = `select co.country_id, co.country
                from country co
                left join city ci on (ci.country_id = co.country_id)
                left join address ad on (ad.city_id = ci.city_id)
                left join store s on (s.address_id = ad.address_id)
                where s.store_id = "1"
                or s.store_id = "2"`;
    conn.query(qr,(err,result) => {
         if(err){
             console.log(err,'errs')
         }
         if(result.length>0) {
             res.send({
                 message:'All countries data',
                 data: result
             });
         }
     });
 });
 

//14. Obtener lista de películas, según el país
app.get('/country/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `SELECT f.film_id, f.title, f.description, COUNT(*) as avaliability
                FROM film f
                LEFT JOIN inventory i ON (f.film_id = i.film_id)
                LEFT JOIN store s ON (s.store_id = i.store_id)
                LEFT JOIN address ad ON (s.address_id = ad.address_id)
                LEFT JOIN city ci ON (ad.city_id = ci.city_id)
                LEFT JOIN country c ON (ci.country_id = c.country_id)
                WHERE c.country_id = ${gID}
                GROUP BY f.title
                HAVING COUNT(*) > 1
                ORDER BY f.title`
    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'err')
        }
        if(result.length>0) {
            res.send({
                message:'Lista de películas de una tienda',
                data: result
            });
        }
        else {
            res.send({
                message:'Error: No existe una tienda de película en ese país'
            });
        }
    });
});



/*------------------ CUSTOMER ---------------------*/
//15. Obtener datos de customer
app.get('/customer',jsonParser,(req,res)=>{
    let qr = `select cu.customer_id, s.store_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, cu.email, ad.address,cu.active, cu.last_update
                from customer cu
                left join store s on (s.store_id = cu.store_id)
                LEFT JOIN address ad ON (ad.address_id = cu.address_id)`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'All Customer data',
                data: result
            });
        }
    });
});

//16. Obtener datos de un cliente
app.get('/customer/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `select cu.customer_id, s.store_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, cu.email, ad.address,cu.active, cu.last_update
                from customer cu
                left join store s on (s.store_id = cu.store_id)
                LEFT JOIN address ad ON (ad.address_id = cu.address_id)
                WHERE cu.customer_id =${gID}`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Film information',
                data: result
            });
        }
    });
});

//17. Modificar la información del cliente
app.put('/customer/:id',jsonParser,(req,res)=>{

    console.log(req.body,'updatedata');
    
    let gID = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let active = req.body.active;

  let qr = `update customer set first_name = '${first_name}', last_name ='${last_name}', email = '${email}', active = '${active}' where customer_id =${gID}`;

        conn.query(qr,(err,result) => {
            if(err){
                console.log(err,'err')
            }
            res.send({
                message:'Información del cliente modificada',
                
            });
        });

});

//18. Agregar cliente
app.post('/customer',jsonParser,(req,res)=>{

    console.log(req.body,'createCustomer');
    
    let store_id =req.body.store_id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let address_id = req.body.address_id;

    let qr = `insert into customer (store_id, first_name, last_name, email, address_id, active, create_date, last_update) 
                values ('${store_id}','${first_name}','${last_name}','${email}','${address_id}','1',NOW(),CURRENT_TIMESTAMP)`;
        conn.query(qr,(err,result) => {
          if(err){
            console.log(err)
          }
          console.log(result,`result`);
          res.send({
            message:'data inserted',
            
        });  
    });   
    
});



/*------------------ FILM ---------------------*/

//19. Obtener todas las películas
app.get('/film',jsonParser,(req,res)=>{
    let qr = 'select * from film';

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'All films data',
                data: result
            });
        }
    });
});

//20. Obtener datos de una sola película
app.get('/films/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `SELECT f.film_id, f.title, f.description,f.release_year, l.name as language , 
                f.length, f.rating, f.special_features, f.last_update 
                FROM film f
                LEFT JOIN language l ON ( f.language_id = l.language_id) 
                LEFT JOIN language ol ON ( f.original_language_id = ol.language_id)
                WHERE film_id =${gID}`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Film information',
                data: result
            });
        }
    });
});

//21. Buscar película por título
app.get('/film/:title', (req, res) => {
    const { title } = req.params;

    let qr = "SELECT film_id, title, description, release_year FROM film WHERE title LIKE '%" + title + "%'";
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});

//22. Agregar películas
app.post('/film',jsonParser,(req,res)=>{

    console.log(req.body,'createFilm');
    
    let title =req.body.title;
    let description = req.body.description;
    let release_year = req.body.release_year;
    let language_id = req.body.language_id;
    let rental_duration = req.body.rental_duration;
    let rental_rate = req.body.rental_rate;
    let length_ = req.body.length_;
    let replacement_post = req.body.replacement_post;
    let rating = req.body.rating;
    let special_features = req.body.special_features;

    let qr = `insert into film (title, description,release_year, language_id, original_language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, last_update) 
                values ('${title}','${description}','${release_year}','${language_id}',NULL,'${rental_duration}','${rental_rate}','${length_}','${replacement_post}','${rating}','${special_features}',CURRENT_TIMESTAMP)`;
        conn.query(qr,(err,result) => {
          if(err){
            console.log(err)
          }
          console.log(result,`result`);
          res.send({
            message:'data inserted: FILM',
            
        });  
    });   
    
});

//23. Obtener películas por rating
app.get('/films/rate/:rate',jsonParser,(req,res)=>{
    let rate = req.params.rate;
    let qr;

    if(rate == 1){
        qr = `SELECT f.film_id, f.title, f.description,f.release_year, l.name as language, f.rental_rate,
            f.length, f.rating, f.special_features, f.last_update 
            FROM film f
            LEFT JOIN language l ON ( f.language_id = l.language_id) 
            LEFT JOIN language ol ON ( f.original_language_id = ol.language_id)
            WHERE f.rental_rate =${0.99}`;
    }
    if(rate == 2){
        qr = `SELECT f.film_id, f.title, f.description,f.release_year, l.name as language, f.rental_rate,
            f.length, f.rating, f.special_features, f.last_update 
            FROM film f
            LEFT JOIN language l ON ( f.language_id = l.language_id) 
            LEFT JOIN language ol ON ( f.original_language_id = ol.language_id)
            WHERE f.rental_rate =${1.99}`;
    }
    if(rate == 3){
        qr = `SELECT f.film_id, f.title, f.description,f.release_year, l.name as language, f.rental_rate,
            f.length, f.rating, f.special_features, f.last_update 
            FROM film f
            LEFT JOIN language l ON ( f.language_id = l.language_id) 
            LEFT JOIN language ol ON ( f.original_language_id = ol.language_id)
            WHERE f.rental_rate =${2.99}`;
    }
    if(rate == 4){
        qr = `SELECT f.film_id, f.title, f.description,f.release_year, l.name as language, f.rental_rate,
            f.length, f.rating, f.special_features, f.last_update 
            FROM film f
            LEFT JOIN language l ON ( f.language_id = l.language_id) 
            LEFT JOIN language ol ON ( f.original_language_id = ol.language_id)
            WHERE f.rental_rate =${3.99}`;
    }
    if(rate == 5){
        qr = `SELECT f.film_id, f.title, f.description,f.release_year, l.name as language, f.rental_rate,
            f.length, f.rating, f.special_features, f.last_update 
            FROM film f
            LEFT JOIN language l ON ( f.language_id = l.language_id) 
            LEFT JOIN language ol ON ( f.original_language_id = ol.language_id)
            WHERE f.rental_rate =${4.99}`;
    }

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Film information',
                data: result
            });
        }
    });
});

/*------------------ FILM_ACTOR --------------------*/
//24. Mostrar datos de la tabla film_actor
app.get('/film_actor',jsonParser,(req,res)=>{
    let qr = `select fa.actor_id, CONCAT(a.first_name, ' ', a.last_name)as actor, fa.film_id, f.title
                from film_actor fa
                left join film f on (f.film_id = fa.film_id)
                left join actor a on (a.actor_id = fa.actor_id)`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Film_actor data',
                data: result
            });
        }
    });
});

//25. Agregar relación entre actores y películas
app.post('/film_actor',jsonParser,(req,res)=>{

    console.log(req.body,'createFilm_ActorData');
    
    let film_id = req.body.film_id;
    let actor_id = req.body.actor_id;

    let qr = `insert into film_actor (film_id, actor_id, last_update) 
                values ('${film_id}','${actor_id}', CURRENT_TIMESTAMP)`;
        conn.query(qr,(err,result) => {
          if(err){
            console.log(err)
          }
          console.log(result,`result`);
          res.send({
            message:'data inserted: Film_actor',
            
        });  
    });   
    
});


/*------------------ INVENTORY ---------------------*/
//26. Mostrar Inventario
app.get('/inventory',jsonParser,(req,res)=>{
    let qr = `SELECT i.inventory_id, f.title, COUNT(*) as Total
                FROM film f
                LEFT JOIN inventory i ON (f.film_id = i.film_id)
                LEFT JOIN store s ON (s.store_id = i.store_id)
                LEFT JOIN address ad ON (s.address_id = ad.address_id)
                LEFT JOIN city ci ON (ad.city_id = ci.city_id)
                LEFT JOIN country c ON (ci.country_id = c.country_id)
                GROUP BY f.title
                HAVING COUNT(*) > 1
                ORDER BY f.title`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'err')
        }
        if(result.length>0) {
            res.send({
                message:'Inventario de una tienda',
                data: result
            });
        }
        else {
            res.send({
                message:'Error: No existe una tienda de película en ese país'
            });
        }
    });
});

//27. Mostrar cantidad de películas según el inventario, en una tienda
app.get('/inventory/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `SELECT i.inventory_id, f.title, s.store_id, COUNT(*) as Total
                FROM film f
                LEFT JOIN inventory i ON (f.film_id = i.film_id)
                LEFT JOIN store s ON (s.store_id = i.store_id)
                LEFT JOIN address ad ON (s.address_id = ad.address_id)
                LEFT JOIN city ci ON (ad.city_id = ci.city_id)
                LEFT JOIN country c ON (ci.country_id = c.country_id)
                WHERE s.store_id = ${gID}
                GROUP BY f.title
                HAVING COUNT(*) > 1
                ORDER BY f.title`;
    
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});

//28. Mostrar información de un invontory
app.get('/inventoryt/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `SELECT i.inventory_id, f.film_id, f.title, s.store_id
                FROM film f
                LEFT JOIN inventory i ON (f.film_id = i.film_id)
                LEFT JOIN store s ON (s.store_id = i.store_id)
                LEFT JOIN address ad ON (s.address_id = ad.address_id)
                LEFT JOIN city ci ON (ad.city_id = ci.city_id)
                LEFT JOIN country c ON (ci.country_id = c.country_id)
                WHERE inventory_id = ${gID}`;
    
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});


//29. Agregar un dato al inventario
app.post('/inventory',jsonParser,(req,res)=>{

    console.log(req.body,'createInventoryData');
    
    let film_id = req.body.film_id;
    let store_id = req.body.store_id;

    let qr = `insert into inventory (film_id, store_id, last_update) 
                values ('${film_id}','${store_id}', CURRENT_TIMESTAMP)`;
        conn.query(qr,(err,result) => {
          if(err){
            console.log(err)
          }
          console.log(result,`result`);
          res.send({
            message:'data inserted in Inventory table',
            
        });  
    });   
    
});


/*------------------ LANGUAGE ---------------------*/

//30. Obtener todos los idiomas
app.get('/language',jsonParser,(req,res)=>{
    let qr = 'select * from language';

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'All languages data',
                data: result
            });
        }
    });
});

/*------------------ PAYMENT ---------------------*/

//31. Mostrar datos de los pagos
app.get('/payment',jsonParser,(req,res)=>{
    let qr = `select p.payment_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, CONCAT(s.first_name, ' ', s.last_name)as staff,r.rental_id, i.inventory_id,f.title, p.amount, p.payment_date,p.last_update
                from payment p
                left join rental r on (r.rental_id = p.rental_id)
                left join inventory i on (r.inventory_id = i.inventory_id)
                LEFT JOIN film f ON (f.film_id = i.film_id)
                left join customer cu on (cu.customer_id = p.customer_id)
                left join staff s on (s.staff_id = p.staff_id)`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'err')
        }
        if(result.length>0) {
            res.send({
                message:'Payment',
                data: result
            });
        }
        else {
            res.send({
                message:'Error: No existe una tienda de película en ese país'
            });
        }
    });
});

//32. Buscar datos de pago según nombre del cliente
app.get('/payment/:name/:last', (req, res) => {
    const { name,last } = req.params;

    let qr = "select p.payment_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, CONCAT(s.first_name, ' ', s.last_name)as staff,r.rental_id, i.inventory_id,f.title, p.amount, p.payment_date,p.last_update from payment p left join rental r on (r.rental_id = p.rental_id) left join inventory i on (r.inventory_id = i.inventory_id) LEFT JOIN film f ON (f.film_id = i.film_id) left join customer cu on (cu.customer_id = p.customer_id) left join staff s on (s.staff_id = p.staff_id)  where cu.first_name  LIKE '%" + name + "%' AND cu.last_name LIKE '%" + last + "%'";
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});

//33. Buscar datos de pago por id
app.get('/payment/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `select p.payment_id, CONCAT(cu.first_name, ' ', cu.last_name)as customer, CONCAT(s.first_name, ' ', s.last_name)as staff,r.rental_id, i.inventory_id,f.title, p.amount, p.payment_date,p.last_update
                from payment p
                left join rental r on (r.rental_id = p.rental_id)
                left join inventory i on (r.inventory_id = i.inventory_id)
                LEFT JOIN film f ON (f.film_id = i.film_id)
                left join customer cu on (cu.customer_id = p.customer_id)
                left join staff s on (s.staff_id = p.staff_id)
                WHERE p.payment_id =${gID}`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Payment information',
                data: result
            });
        }
    });
});

//34. Agregar datos a la tabla de pagos
app.post('/payment',jsonParser,(req,res)=>{

    console.log(req.body,'createPaymentData');
    
    let customer_id = req.body.customer_id;
    let staff_id = req.body.staff_id;
    let rental_id = req.body.rental_id;
    let amount = req.body.amount;

    let qr = `insert into payment (customer_id, staff_id, rental_id, amount, payment_date,last_update) 
                values ('${customer_id}','${staff_id}','${rental_id}','${amount}',NOW(),CURRENT_TIMESTAMP)`;
        conn.query(qr,(err,result) => {
          if(err){
            console.log(err)
          }
          console.log(result,`result`);
          res.send({
            message:'data inserted in Rental table',
            
        });  
    });   
    
});

/*------------------ RENTAL ---------------------*/
//35. Mostrar datos de la renta de películas5
app.get('/rental',jsonParser,(req,res)=>{
    let qr = `select r.rental_id, r.rental_date, f.title, CONCAT(cu.first_name, ' ', cu.last_name)as customer,r.return_date, CONCAT(s.first_name, ' ', s.last_name)as staff, r.last_update
                from rental r
                left join inventory i on (r.inventory_id = i.inventory_id)
                LEFT JOIN film f ON (f.film_id = i.film_id)
                left join customer cu on (cu.customer_id = r.customer_id)
                left join staff s on (s.staff_id = r.staff_id)`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'err')
        }
        if(result.length>0) {
            res.send({
                message:'Rental',
                data: result
            });
        }
        else {
            res.send({
                message:'Error: No existe una tienda de película en ese país'
            });
        }
    });
});

//36. Obtener datos de un id
app.get('/rental/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `select r.rental_id, r.rental_date, f.title, CONCAT(cu.first_name, ' ', cu.last_name)as customer,r.return_date, CONCAT(s.first_name, ' ', s.last_name)as staff, r.last_update
                from rental r
                left join inventory i on (r.inventory_id = i.inventory_id)
                LEFT JOIN film f ON (f.film_id = i.film_id)
                left join customer cu on (cu.customer_id = r.customer_id)
                left join staff s on (s.staff_id = r.staff_id)
                WHERE rental_id =${gID}`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Rental information',
                data: result
            });
        }
    });
});

//37. Buscar datos de rental según nombre del cliente
app.get('/rental/:name/:last', (req, res) => {
    const { name,last } = req.params;

    let qr = "select r.rental_id, r.rental_date, f.title, CONCAT(cu.first_name, ' ', cu.last_name)as customer,r.return_date, CONCAT(s.first_name, ' ', s.last_name)as staff, r.last_update from rental r left join inventory i on (r.inventory_id = i.inventory_id) LEFT JOIN film f ON (f.film_id = i.film_id) left join customer cu on (cu.customer_id = r.customer_id) left join staff s on (s.staff_id = r.staff_id) where cu.first_name  LIKE '%" + name + "%' AND cu.last_name LIKE '%" + last + "%'";
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});

//38. Agregar datos de renta
app.post('/rental',jsonParser,(req,res)=>{

    console.log(req.body,'createRentalData');
    
    let rental_date = req.body.rental_date;
    let inventory_id = req.body.inventory_id;
    let customer_id = req.body.customer_id;
    let return_date = req.body.return_date;
    let staff_id = req.body.staff_id;

    let qr = `insert into rental (rental_date, inventory_id, customer_id, return_date, staff_id,last_update) 
                values ('${rental_date}','${inventory_id}','${customer_id}','${return_date}','${staff_id}',CURRENT_TIMESTAMP)`;
        conn.query(qr,(err,result) => {
          if(err){
            console.log(err)
          }
          console.log(result,`result`);
          res.send({
            message:'data inserted in Rental table',
            
        });  
    });   
    
});



/*------------------ STAFF ---------------------*/

//39. Mostrar datos de staff
app.get('/staff',jsonParser,(req,res)=>{
    let qr = `select s.staff_id, CONCAT(s.first_name, ' ', s.last_name)as staff,ad.address, s.email, st.store_id, s.active, s.username, s.last_update
                from staff s
                left join address ad on (ad.address_id = s.address_id)
                left join store st on (st.store_id = s.store_id)`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'err')
        }
        if(result.length>0) {
            res.send({
                message:'Staff',
                data: result
            });
        }
        else {
            res.send({
                message:'Error: No se encuentran lista de staff'
            });
        }
    });
});

//40. Buscar datos del staff según nombre del mismo
app.get('/staff/:name/:last', (req, res) => {
    const { name,last } = req.params;

    let qr = "select s.staff_id, CONCAT(s.first_name, ' ', s.last_name)as staff,ad.address, s.email, st.store_id, s.active, s.username, s.last_update from staff s left join address ad on (ad.address_id = s.address_id) left join store st on (st.store_id = s.store_id)  where s.first_name  LIKE '%" + name + "%' AND s.last_name LIKE '%" + last + "%'";
    conn.query(qr, (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});

//41. Buscar datos del staff por id
app.get('/staff/:id',jsonParser,(req,res)=>{
    let gID = req.params.id;
    let qr = `select s.staff_id, CONCAT(s.first_name, ' ', s.last_name)as staff,ad.address, s.email, st.store_id, s.active, s.username, s.last_update
                from staff s
                left join address ad on (ad.address_id = s.address_id)
                left join store st on (st.store_id = s.store_id)
                WHERE s.staff_id =${gID}`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'errs')
        }
        if(result.length>0) {
            res.send({
                message:'Staff information',
                data: result
            });
        }
    });
});

//42. Agregar staff
app.post('/staff',jsonParser,(req,res)=>{

    console.log(req.body,'createStaffData');
    
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let address_id = req.body.address_id;
    let email = req.body.email;
    let store_id = req.body.store_id;
    let username = req.body.username;
    let password = req.body.password;

    let qr = `insert into staff (first_name, last_name, address_id, picture, email, store_id, active, username, password,last_update) 
                values ('${first_name}','${last_name}','${address_id}',NULL,'${email}','${store_id}','1','${username}','${password}',CURRENT_TIMESTAMP)`;
        conn.query(qr,(err,result) => {
          if(err){
            console.log(err)
          }
          console.log(result,`result`);
          res.send({
            message:'data inserted in Staff table',
            
        });  
    });   
    
});

//43. Modificar datos del staff
app.put('/staff/:id',jsonParser,(req,res)=>{

    console.log(req.body,'updateStaffdata');
    
    let gID = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let active = req.body.active;

  let qr = `update staff set first_name = '${first_name}', last_name ='${last_name}', email = '${email}', active = '${active}' where staff_id =${gID}`;

        conn.query(qr,(err,result) => {
            if(err){
                console.log(err,'err')
            }
            res.send({
                message:'Información del staff modificada',
                
            });
        });

});

/*------------------ STORE ---------------------*/

//44. Obtener la ubicación de las tiendas
app.get('/store',jsonParser,(req,res)=>{
    let qr = `SELECT st.store_id, CONCAT(s.first_name, ' ', s.last_name)as staff, ad.address, st.last_update
                FROM store st 
                left join staff s on (st.manager_staff_id = s.staff_id)
                LEFT JOIN address ad ON (ad.address_id = st.address_id);`;

    conn.query(qr,(err,result) => {
        if(err){
            console.log(err,'err')
        }
        if(result.length>0) {
            res.send({
                message:'Staff',
                data: result
            });
        }
        else {
            res.send({
                message:'Error: No se encuentran las tiendas'
            });
        }
    });
});
