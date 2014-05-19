<?php

	define('NL', "\n");
	define('TAB', "\t");
	define ('PROJECT_PATH', realpath(__DIR__.'/../..').'/');
	
	$path = PROJECT_PATH.'web-src/js/';
	
	$dir = opendir($path);
		
	$output = fopen(PROJECT_PATH.'web-static/js/scripts.js','w');
	
	browseDir($path, $dir, $output, $fileList);
	ksort($fileList);
	
	foreach($fileList as $path => $content){
		fwrite($output, $content.NL);
		echo $path.' ecrit'.NL;
	}
	
	function browseDir($path, $dir, &$output, &$fileList){
		while($file = readdir ($dir)){
			if($file != '.' && $file != '..'){
			
				if(!is_dir($path.$file)){
					$content = file_get_contents($path.$file);
					$content = str_replace('<?php', '', $content);
					$fileList[$path.$file] = $content;
					//fwrite($output, $content);
				}
				else {
					$path2 = $path.$file.'/';
					$dir2 = opendir($path2);
					browseDir($path2, $dir2, $output, $fileList);
				}
			}
		}
		closedir($dir);
	}