<?php

namespace Order;

error_reporting(E_ERROR | E_PARSE | E_NOTICE | E_WARNING);
require_once('lib/init.php');
require_once('utils/SvgUtils.php');
require_once('utils/Utils.php');
require_once('configs.php');
header("Access-Control-Allow-Origin: *");

use Liveart\Utils as Utils;
use Liveart\Configs as Configs;
use Liveart\SvgUtils as SvgUtils;

$guid = $_GET['design_id'];
$lajsFolder = Configs::$LAJS_FOLDER_PATH;
$designFolderPath = $lajsFolder . Configs::$DESIGNS_RELATIVE_PATH . $guid . "/";

$json = SvgUtils::readSavedDesign($designFolderPath);
$isPHPzipInstalled = extension_loaded('zip');
if ($isPHPzipInstalled) {
    $res = Utils::processDesign($guid);
    $filesToZip = $res["filesToZip"];

    $zipFilename = $designFolderPath . $guid . ".zip";
    $zip = Utils::zipFiles($zipFilename, $designFolderPath, $filesToZip);

    $zipNumFiles = $zip->numFiles;
    $zipStatus = $zip->status;

    $zip->close();
}
?>
<!doctype html>
<html>
<body>
<link href="<?php echo $lajsFolder;?>assets/bootstrap/css/bootstrap.css" type="text/css" rel="stylesheet"/>
<style>
	body {padding: 10px;}
	div.location > svg {position: relative !important;}
	div.location {text-align: center;}
	div.location object {display: block; margin: auto;}
	.warning label {color: red;}
</style>

<h4>Config vars:</h4>
<?php
$inkscapeInfo = Utils::checkInkscape();
$inkscapeVersion = $inkscapeInfo["version"];
if(!$inkscapeInfo["installed"]){ ?>
	<span class="warning">
		<label>WARNING:</label>
		Inkscape is not installed
	</span>
	<br/>
<?php } else { ?>
	<ul>
		<?php
		for ($i = 0; $i < sizeof($inkscapeVersion); $i++) {
			?>
			<li><?php echo $inkscapeVersion[$i]; ?></li>
		<?php } ?>
	</ul>
<?php }?>
<?php
if(!$isPHPzipInstalled){ ?>
    <span class="warning">
    <label>WARNING:</label>
    PHP Zip Extension is not installed
  </span>
    <br/>
<?php } else { ?>
    <ul>
        <li>PHP Zip Extension installed</li>
    </ul>
<?php }?>
<ul>
	<li><label>OUTPUT_TYPE:</label> <?php echo Configs::$OUTPUT_TYPE; ?></li>
	<li><label>EXPORT_DPI:</label> <?php echo Configs::$EXPORT_DPI; ?></li>
	<li><label>SKIP_BOUNDS:</label> <?php echo (Configs::$SKIP_BOUNDS ? 'true' : 'false'); ?></li>
	<li><label>USE_UNITS:</label> <?php echo (Configs::$USE_UNITS ? 'true' : 'false'); ?></li>
</ul>

<h1>Details for order #<?php echo $guid; ?>:</h1>

<?php
if (isset($json->data->product->name)) {
	?>
	<h4>Product: <?php echo $json->data->product->name; ?>
		<?php if(isset ($json->data->product->colorName)) {?>
			(<?php echo $json->data->product->colorName; ?>)
		<?php } ?>
	</h4>
	<?php
}
?>

<?php
//iterating design locations
foreach($json->data->locations as $loc) {
	// Remove anything which isn't a word, whitespace, number
	// or any of the following caracters -_~,;:[]().
	$locname = preg_replace("([^\w\d\-_~,;:\[\]\(\).])", '', $loc->name);
	?>
	<div class='location'>
		<div>
			<b>Location: <?php echo $loc->name ?></b>
			<br/>
			<?php
			$designFiles = array();
			foreach (glob($designFolderPath."*.{pdf,svg,png}", GLOB_BRACE) as $filename) {
				if (strpos($filename, $loc->name) === false) {
					array_push($designFiles, basename($filename));
				}
			}
			for ($i = 0; $i < count($designFiles); $i++) {
				if($i == 0) {
				} ?>
				<a href="<?php echo $designFolderPath. $designFiles[$i]; ?>"><?php echo $designFiles[$i].PHP_EOL; ?></a>
				<?php
				if($i != count($designFiles) - 1) {
					?>
					,
					<?php
				}
			}
			?>
		</div>
		<?php
		$filename = "design_".$locname.".svg";
		//5. load saved file with correct dimensions
		?>
		<object type='image/svg+xml' data='<?php echo $designFolderPath.$filename; ?>'></object>
	</div>
	<?php
}

if ($isPHPzipInstalled) {
?>
	<div class="well well-small" style="clear: both; margin: 20px 50px; 10px 50px;">
		<a href='<?php echo $zipFilename; ?>'>
			<h4><i class='icon-download-alt'></i>download zip package</h4>
		</a>
		<small><?php echo "Zip filename: " . $guid . ".zip" . " numfiles: " .$zipNumFiles . " status: " . $zipStatus . "\n"; ?></small>
	</div>
        <?php } ?>
</body>
</html>