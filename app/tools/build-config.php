<?php

	define ('PROJECT_PATH', realpath(__DIR__.'/../..').'/');
	

	define('NL', "\n");
	define('TAB', "\t");

	// echo'<pre>';
	
	if(!isset($argv[1])){
		die('Manque argument');
	}
	
	$path = PROJECT_PATH.'app/config/';
	$dir = opendir($path);
	
	$output = fopen(PROJECT_PATH.'app/config.php','w');
	
	fwrite($output, '<?php'.NL);
	
	while($file = readdir ($dir)){
		if($file != '.' && $file != '..'){
		
			if(!is_dir($path.$file)){
				$content = file_get_contents($path.$file);
				$content = str_replace('<?php', '', $content);
				$fileList[$path.$file] = $content;
			}
			else if ($file == $argv[1]){
			
				$file = $file.'/';
				$sous_dossier = opendir($path.$file);
				while($file2 = readdir ($sous_dossier)){
					$path2 = $path.$file.'/';
					if($file2 != '.' && $file2 != '..')
					{
						$content = file_get_contents($path2.$file2);
						$content = str_replace('<?php', '', $content);
						$fileList[$path2.$file2] = $content;
					}
				}
				closedir($sous_dossier);
			}
		}
	}
	closedir($dir);
	ksort($fileList);
	foreach($fileList as $path => $content){
		fwrite($output, NL.'/******* '. $path.' ********/'.NL);
		fwrite($output, $content.NL);
		echo $path.' ecrit'.NL;
	}
	
	function browseDir($path, $flag = false){
	
		
	
	}
	browseDir($path);
	
	// echo'</pre>';