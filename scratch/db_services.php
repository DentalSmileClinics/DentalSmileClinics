<?php
$c=mysqli_connect('maglev.proxy.rlwy.net','root','KVmgPljIvpTqoOkauLimhZVzFJmtXxtR','railway',59766);
$res=$c->query('SELECT * FROM services');
while($row = $res->fetch_assoc()) {
    print_r($row);
}
?>
