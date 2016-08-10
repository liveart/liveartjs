<?php
        define("REQUEST_QUERYSTRING", 1);
        define("REQUEST_FORM", 2);
        define("REQUEST_COOKIES", 4);
        define("REQUEST_SERVERVARIABLES", 8);
        define("REQUEST_FILES", 16);
        define("REQUEST_USERDATA", REQUEST_QUERYSTRING | REQUEST_FORM);
        define("REQUEST_ALL", REQUEST_QUERYSTRING | REQUEST_FORM | REQUEST_COOKIES | REQUEST_SERVERVARIABLES);

        /*
         * Public. Class holds all browser input
         */
        class Request {
                // Class information
                var $className = "Request";
                var $version = "1.0";

                // Collections;
                var $Cookies;
                var $QueryString;
                var $Form;
                var $ServerVariables;
                var $Files;

                /*
                 * Constructor. Make collections initialization
                 */
                function Request() {
						$this->Cookies = $GLOBALS["_COOKIE"];
                        $this->QueryString = $GLOBALS["_GET"];
                        $this->Form = $GLOBALS["_POST"];
                        $this->ServerVariables = $GLOBALS["_SERVER"];
                        $this->Files = $GLOBALS["_FILES"];

						/*
                        $this->Cookies = $GLOBALS["HTTP_COOKIE_VARS"];
                        $this->QueryString = $GLOBALS["HTTP_GET_VARS"];
                        $this->Form = $GLOBALS["HTTP_POST_VARS"];
                        $this->ServerVariables = $GLOBALS["HTTP_SERVER_VARS"];
                        $this->Files = $GLOBALS["HTTP_POST_FILES"];
						*/
                }

                /*
                 * Private. Check for magic quotesm, if variable is array
                 * check for quotas in array.
                 *
                 * @param $value value to be checked
                 * @return       correct value
                 */
                function prepareValue($value) {
                        if (get_magic_quotes_gpc()) {
                                if (is_array($value)) {
                                        $result = array();
                                        foreach($value as $key=>$item)
                                                $result[$key] = stripslashes($item);
                                        return $result;
                                }
                                else
                                        return stripslashes($value);
                        }
                        else
                                return $value;
                }

                /*
                 * Public. Function searches specified varible in user request.
                 * Search sequence RequestString, Form, Cookies,
                 *
                 * @param $name        name of variable to be searched
                 * @param $requestType type of collection to be searched
                 * @return             value of specified variable or nulll if
                 *                     variable is not found
                 */
                function Value($name, $requestType = REQUEST_ALL) {
                        if (($requestType & REQUEST_QUERYSTRING) && isset($this->QueryString[(string)$name]))
                                return $this->prepareValue($this->QueryString[(string)$name]);
                        if (($requestType & REQUEST_FORM) && isset($this->Form[(string)$name]))
                                return $this->prepareValue($this->Form[(string)$name]);
                        if (($requestType & REQUEST_COOKIES) && isset($this->Cookies[(string)$name]))
                                return $this->prepareValue($this->Cookies[(string)$name]);
                        if (($requestType & REQUEST_SERVERVARIABLES) && isset($this->ServerVariables[(string)$name]))
                                return $this->ServerVariables[(string)$name];
                        if (($requestType & REQUEST_FILES) && isset($this->Files[(string)$name]))
                                return $this->Files[(string)$name];
                        return null;
                }

                /*
                 * Public. Function return string representatin of the specified
                 * value using specified rules
                 *
                 * @param $name       name of variable to be searched
                 * @param $default    default value return if varialbe not found
                 * @param $min        minimum string length
                 * @param $max        maximum string length
                 * @param $stripWhite strip or not leading and trailing spaces
                 * @param $case       0 - no translation, 1 -  translate to upper case,
                 *                    2 - translate to lower case
                 * @return            value of specified variable or $default value if
                 *                    variable is not found
                 */
                function ToString($name, $default = null, $min = null, $max = null, $stripWhite = true, $case = 0) {
                        // Retrive value
                        $value = $this->Value($name, REQUEST_USERDATA);
                        // Value is of string?
                        if (is_null($value))
                                return $default;
                        // Stripping leading and trailing whitespaces
                        if ($stripWhite)
                                $value = trim($value);
                        // Processing value to upper or lower if needed
                        if ($case == 1)
                                $value = strtoupper($value);
                        elseif ($case == 2)
                                $value = strtolower($value);
                        // Checking if string is not out of bounds
                        if (((int)$max > 0) && (strlen($value) > (int)$max))
                                return $default;
                        if (((int)$min > 0) && (strlen($value) < (int)$min))
                                return $default;
                        return $value;
                }

                /*
                 * Public. Function return number representatin of the specified
                 * value using specified rules
                 *
                 * @param $name       name of variable to be searched
                 * @param $default    default value return if varialbe not found
                 * @param $min        minimum number value
                 * @param $max        maximum number value
                 * @return            value of specified variable or $default value if
                 *                    variable is not found
                 */
                function ToNumber($name, $default = null, $min = null, $max = null) {
                        // Retrive value
                        $value = $this->Value($name, REQUEST_USERDATA);
                        // Value is of string?
                        if (is_null($value))
                                return $default;
                        $value = (int)$value;
                        // Checking if string is not out of bounds
                        if (((int)$max > 0) && ($value > (int)$max))
                                return $default;
                        if (((int)$min > 0) && ($value < (int)$min))
                                return $default;
                        return $value;
                }
                
                function GetAllVariables($prefix = "", $requestType = 0 ) {
                        if (!$requestType) $requestType = REQUEST_QUERYSTRING | REQUEST_FORM;
                        $result = Array();
                        if ($requestType & REQUEST_QUERYSTRING) $this->_filterArray($this->QueryString, $prefix, $result);
                        if ($requestType & REQUEST_FORM) $this->_filterArray($this->Form, $prefix, $result);
                        return $result;
                }
                
                function _filterArray(&$array, $prefix, &$resultingArray, $exclude_prefix = true) {
                        foreach ($array as $key => $value) {
                                if (!$prefix) {$resultingArray[$key] = $value;} 
                                        elseif (strpos($key , $prefix) === 0) {
                                                if ($exclude_prefix) $key = substr($key,strlen($prefix));
                                                $resultingArray[$key] = $this->prepareValue($value);
                                        }
                        }
                }
                
        }
?>