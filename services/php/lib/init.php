<?php
	require_once('functions.php');
	require_once('LoggerStub.php');

    require_once(dirname(__FILE__) . '/../configs.php');
    use Liveart\Configs as Configs;

    // Load composer dependencies (required for Monolog)
	if (Configs::$GEN_VIZ_LOGS) {
	  require_once(dirname(__FILE__) . '/../vendor/autoload.php');
	}
?>