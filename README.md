#ELW-Locker-System
A prototype locker registration system for reserving lockers in the Engineering Lab Wing of UVic managed by the Engineering Students Society.

#How to install?

Install MySQL if you have not already

,,,
sudo apt-get install mysql-server-5.6
,,,

,,,
git clone https://github.com/geofflorne/ELW-Locker-System.git
,,,


Run the MySQL set up script or set up the database manually (note the DB configuration in sever.js and CreateSQL.php)
,,,
php CreateSQL.php
,,,

In the Lockers folder:
,,,
npm install
npm install nodemon -g
nodemon
,,,
