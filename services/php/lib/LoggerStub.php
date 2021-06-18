<?php

namespace Liveart;

/**
 * Mimic Monolog in case composer not initialized
 */
class LoggerStub {

	private $name;
	private $age;

	function __construct( ) { }

	function pushHandler() { }

	function info() { }

	function error() { }

	function debug() { }

}