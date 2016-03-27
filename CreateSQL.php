<?php
$servername = "localhost";
$username = "root";
$password = "lockers";
$database = "ELW";
$table = "lockers";

// Create connection
$conn = mysqli_connect($servername, $username, $password);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully\n";

$sql = "CREATE DATABASE ELW";
if (mysqli_query($conn, $sql)) {
    echo "Database created successfully\n";
} else {
    echo "Error creating database: " . mysqli_error($conn);
}

$sql = "USE ELW";
if (mysqli_query($conn, $sql)) {
    echo "Switching to database: ELW\n";
} else {
    echo "Error switching database: " . mysqli_error($conn);
}

// sql to create table
$sql = "CREATE TABLE lockers (
  locker_number INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(50),
  registration_date DateTime,
  status enum('reserved','open','out of order','pending'),
  renewed boolean,
  renewed_date datetime
)";

if (mysqli_query($conn, $sql)) {
    echo "Table lockers created successfully\n";
} else {
    echo "Error creating table: " . mysqli_error($conn);
}


for($i = 1; $i <= 308; $i++){
  $sql = "INSERT INTO lockers (locker_number, status)
  VALUES ('.$i.','open');";


  if (mysqli_query($conn, $sql)) {
      echo "Initializing locker ";
      echo $i."\r";
    } else {
      echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

}
echo "\nAll done! \n";
mysqli_close($conn);

?>
