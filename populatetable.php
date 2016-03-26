<?php
$servername = "localhost";
$username = "root";
$password = "lockers";
$database = "ELW";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";

for($i = 1; $i <= 308; $i++){
  $sql = "INSERT INTO lockers (locker_number, status)
  VALUES ('.$i.','open');";


  if (mysqli_query($conn, $sql)) {
      echo "New record created successfully";
    } else {
      echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

}

mysqli_close($conn);

?>
