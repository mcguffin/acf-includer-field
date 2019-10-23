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

use ACFIncluderField\Asset;
use ACFIncluderField\Fields;

class Core extends Plugin implements CoreInterface {

	/**
	 *	@inheritdoc
	 */
	protected function __construct() {

		add_action( 'acf/include_field_types', [ $this, 'init_includer_field' ] );

		$args = func_get_args();
		parent::__construct( ...$args );
	}


	/**
	 *	@action acf/include_field_types
	 */
	public function init_includer_field() {
		// initialize
		$this->includer_field = new Fields\IncluderField();

	}

}
