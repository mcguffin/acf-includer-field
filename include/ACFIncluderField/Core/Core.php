<?php
/**
 *	@package ACFIncluderField\Core
 *	@version 1.0.1
 *	2018-09-22
 */

namespace ACFIncluderField\Core;

if ( ! defined('ABSPATH') ) {
	die('FU!');
}

use ACFIncluderField\Fields;

class Core extends Plugin {

	/**
	 *	@inheritdoc
	 */
	protected function __construct() {

		add_action( 'acf/include_field_types', 	array( $this, 'init_includer_field' ) );

		$args = func_get_args();

		parent::__construct( ...$args );

	}

	/**
	 *	@action acf/include_field_types
	 */
	public function init_includer_field() {
		// initialize
		new Fields\IncluderField();

	}


	/**
	 *	Get asset url for this plugin
	 *
	 *	@param	string	$asset	URL part relative to plugin class
	 *	@return string URL
	 */
	public function get_asset_url( $asset ) {
		return plugins_url( $asset, $this->get_plugin_file() );
	}


	/**
	 *	Get asset url for this plugin
	 *
	 *	@param	string	$asset	URL part relative to plugin class
	 *	@return string URL
	 */
	public function get_asset_path( $asset ) {
		return $this->get_plugin_dir() . '/' . preg_replace( '/^(\/+)/', '', $asset );
	}


}
