there is 2 folder
1) nodedemo : I use this folder as a backend 
	- we use nodejs and mongoose for store data in database and authenticate
2) vuedemo : I use this folder as a frontend
	- we can pass all data from here
	
for access this project node,npm and mongodb should install in pc.
 - first open nodedemo in terminal and install npm after than call "npm start" comand.
 - when nodeproject run it will automatic generate demo user
 - then keep this window as it is, and open vuedemo in another terminal tab,and call "npm run serve" after that you may login with test@test.com/Admin@123 username and password






In this practical coding test your task is to extend the current functionality of the Lumen application.

The test should take 2 hours, please respect the deadline.

The application would be used to manage products and orders of the users. 

A theoretical User API microservice is reachable on the following URL and should be used to verify the user: https://reqres.in/api/users/[ID]

The API should be protected by api-tokens, you will find these in AuthServiceProvider.
Tasks
    1. Create new database migration and CRUD service to manage Products:
        a. The Product model should contain the following information: Name, Description, Quantity, In Stock? (product in stock if the quantity is greater than zero)
        b. Only the “Administrator” can create, update or delete Products, there is no authorization on listing them.

        done
    2. Create new database migration and CRUD service to manage Orders. 
        a. The Order model should contain the following information: User ID, Order Status (pending, accepted, processed), delivery address (name, city, postcode, street) and the Product IDs with the ordered quantity.
        done
        b. “Administrator” and “Site API” should be able to interact with Orders.
        c. Orders should be rejected if they contain any out of stock products.
        done
        d. Filtering ability on the Order Status
        done
        e. Create a scheduled job, which sets any accepted orders created the previous day as “processed”
        done
        f. Upon an order is “accepted” (status will be set through the Order’s Update API) the application should send an email to the user’s email address.

Considerations
    • Versioning
    • Testing
    • Complexity

If you do not complete the whole exercise, make sure to submit whatever you have before the deadline.

 4m 37s

