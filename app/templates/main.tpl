<?php
include ('header.tpl');
?>

<script src = "<?php echo WEB_STATIC_URI;?>js/scripts.js"></script>

</head>
<body>

<?php
echo '<div style="color:green"> Bonjour '.$_SESSION['user']->getLogin().' !</div>';
?>

<script>
var user = <?php echo $_SESSION['user']->toJSON()?>;
var ENCRYPT_ENABLED = <?php echo (ENCRYPT_ENABLED?'true':'false')?>;
var FB_APP_ID = '<?php echo FB_APP_ID ?>'; 
var LOCALE = '<?php echo $_SESSION['locale'] ?>';
</script>

<div id = "game">
		<canvas id="main-scene-canvas" width = "800" height = "600"></canvas>
</div>

</body>