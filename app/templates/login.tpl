<?php
include ('header.tpl');
?>

<body>

<form method="POST" action="<?php echo $_SERVER['PHP_SELF'];?>">
<?php
if($error){
	echo '<div style="color:red">'.$error.'</div>';
}
?>
<div>
	<label for="login">Login :</label>
	<input type="text" id="login" name="login"/>
</div>
<div>
	<label for="password">Password :</label>
	<input type="password" id="password" name="password"/>
</div>
<div>
	<input type="submit" name="action-login" value="Connexion"/>
	<input type="submit" name="action-register" value="Création"/>
</div>
</form>

</head>
</body>