<?php
$c=mysqli_connect('maglev.proxy.rlwy.net','root','KVmgPljIvpTqoOkauLimhZVzFJmtXxtR','railway',59766);
$res=$c->query('SHOW CREATE TABLE appointments');
print_r($res->fetch_assoc());
$res2=$c->query('SHOW CREATE TABLE services');
print_r($res2 ? $res2->fetch_assoc() : $c->error . "\n");
$res3=$c->query('SHOW CREATE TABLE treatment_services');
print_r($res3 ? $res3->fetch_assoc() : $c->error . "\n");
$res4=$c->query('SHOW CREATE TABLE treatments');
print_r($res4 ? $res4->fetch_assoc() : $c->error . "\n");
?>
