<?php
class Utils
{
    public static function handle_version($obj)
    {
        if ($obj['name'] == 'PHP')
        {
            return phpversion();
        }

        if ($obj['name'] == 'PHP ZIP extension')
        {
            return Utils::check_zip_extension() ? phpversion('zip') : 'none';
        }

        if ($obj['name'] == 'Inkscape')
        {
            return Utils::get_inkscape_version();
        }

        if ($obj['name'] == 'Ghostscript')
        {
            return Utils::get_gs_version();
        }

        return '0.0.0';
    }

    public static function get_inkscape_version()
    {
        exec("inkscape --version", $out, $rcode);
        return $rcode !== 0 ? 'none' : implode(',', $out);
    }

    public static function get_image_magick_version()
    {
        exec("convert -version", $out, $rcode);
        return $rcode !== 0 ? 'none' : implode(',', $out);
    }

    public static function get_gs_version()
    {
        exec("gs --version", $out, $rcode);
        return $rcode !== 0 ? 'none' : implode(',', $out);
    }

    public static function check_zip_extension()
    {
        return extension_loaded('zip');
    }
}