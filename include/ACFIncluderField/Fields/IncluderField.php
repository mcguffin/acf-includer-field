<?php

namespace ACFIncluderField\Fields;

// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;

use ACFIncluderField\Asset;
use ACFIncluderField\Core;

class IncluderField extends \acf_field {


	/*+
	 *  @inheritdoc
	 */
	public function initialize() {

		$this->name = 'includer-field';
		$this->label = __('Include Fields', 'acf-includer-field');
		$this->category = 'relational';
		$this->defaults = array(
			'field_group_key' => 0,
		);

		add_action( 'acf/field_group/admin_enqueue_scripts',	[ $this, 'field_group_admin_enqueue_scripts' ] );

		add_filter( 'acf/load_fields', [ $this, 'resolve_fields' ], 5, 2 );

	}


	/*+
	 *  @inheritdoc
	 */
	public function render_field_settings( $field ) {

		$current_field_group_key = isset( $_REQUEST['post'] ) ? intval($_REQUEST['post']) : null;

		foreach ( acf_get_field_groups() as $field_group ) {
			if ( $current_field_group_key === $field_group['ID'] ) {
				continue;
			}
			$field_group_choices[ $field_group['key'] ] = $field_group['title'];
		}

		acf_render_field_setting( $field, array(
			'name'			=> 'field_group_key',
			'label'			=> __('Field Group','acf-includer-field'),
			'instructions'	=> __('Include all fields from selected Field Group','acf-includer-field'),
			'type'			=> 'select',
			'choices'		=> $field_group_choices,
		));

	}

	/**
	 *	Enqueue field-specific style
	 *
	 *	@action acf/field_group/admin_enqueue_scripts
	 */
	public function field_group_admin_enqueue_scripts() {

		Asset\Asset::get( 'css/acf-field-group.css' )
			->deps( 'acf-field-group' )
			->enqueue();

	}

	/**
	 *	Replace includer field with fields from field group
	 *
	 *	@filter acf/load_fields
	 */
	public function resolve_fields( $fields, $parent ) {

		if ( ! $this->should_resolve() ) {
			return $fields;
		}

		$return_fields = [];
		foreach ( $fields as $field ) {

			if ( $this->name === $field['type'] ) {
				$return_fields = array_merge( $return_fields, $this->resolve_field( $field ) );

			} else {
				$return_fields[] = $field;
			}
		}

		return $return_fields;
	}

	/**
	 *	Resolve Includer Field: turn field into many
	 *
	 *	@param array $field Includer Field to resolve
	 *	@return array Fields
	 */
	private function resolve_field( $field ) {

		$ret = [];
		$parent = acf_get_field_group( $field['field_group_key'] );
		if ( isset( $field['parent_layout'] ) ) {
			$parent['parent_layout'] = $field['parent_layout'];
		}
		$include_fields = acf_get_fields( $parent  );

		foreach ( $include_fields as $include_field ) {

			$include_field['parent'] = $field['parent'];

			// support flexible content field
			if ( isset( $field['parent_layout'] ) ) {

				$include_field['parent_layout'] = $field['parent_layout'];

			}

			$ret[] = $include_field;
		}

		return $ret;
	}

	/**
	 *	Whether includer fields should resolve to fields
	 *
	 *	@param array $field_group
	 *	@return boolean
	 */
	private function should_resolve() {
		// is sync
		if ( isset( $_REQUEST['post_type'] ) && $_REQUEST['post_type'] === 'acf-field-group' ) {
			return false;
		}
		global $pagenow;
		if (  $pagenow === 'post.php' && 'acf-field-group' === get_post_type() ) {
			return false;
		}
		return true;
	}




	/**
	 *  @inheritdoc
	 */
	function load_field( $field ) {

		// stolen from tab field

		// remove name to avoid caching issue
		$field['name'] = '';

		// remove instructions
		$field['instructions'] = '';

		// remove required to avoid JS issues
		$field['required'] = 0;

		// set value other than 'null' to avoid ACF loading / caching issue
		$field['value'] = false;

		// return
		return $field;

	}

}
