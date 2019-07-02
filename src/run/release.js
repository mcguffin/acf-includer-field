/*
Set version in files
*/

// versioning
const semver = require('semver');
const wp = require('./lib/wp-release.js');
const fs = require('fs');
const glob = require('glob');

// buuilding
const localGulp = require('../../gulpfle.js');

const old_version,
	package_name,
	identifier, version;

var package;

/**
 *	Increment Version number in all affected files
 */
// get prev version
package = require('../../package.json'); // relative to this dir ...
old_version = package.version;

// check cli args
identifier = process.argv.length > 2 ? process.argv[2] : 'patch';
if ( ['major','minor','patch'].indexOf(identifier) === -1 ) {
	throw "Invalid version identifier. Must be one of  ['major','minor','patch']";
}

// new version number
version = semver.inc( old_version, identifier )

// update package.json
package.version = version;
fs.writeFileSync( 'package.json', JSON.stringify( package, null, 2 ) ); // relative to process.cwd()

// update wp plugin/theme files
wp.get_header_files().forEach(file => {
	wp.write_header_tag(file,'Version',version);
});
package_name = wp.get_package_name();

// update *.pot
glob.sync('languages/*.pot').forEach( file => {
	let content = fs.readFileSync( file, { encoding: 'utf8' } );
	// "Project-Id-Version: Serial 0.0.4\n"

	content = content.replace(
		/(Project-Id-Version:\s)(.*)(\\n)/im,
		'$1'+ package_name + ' ' + version +'$3'
	);
	fs.writeFileSync(file,content)
});



// gulp build
localGulp.build()



// npm run release:git



/*
Release pipeline:

A. Sources (Always)
`npm run release [major|minor|patch]`
 - [x] Build i18n => npm run i18n
 - [ ] Increment versions (readme.txt, package.json, style.css, src/scss/style.scss, main plugin file, languages/xxx.pot)
 - [ ] Build assets => $ gulp build
 - [ ] commit -m "release x.y.z"
 - [ ] create git tag "x.y.z"
 - [ ] push

B. Release to wp.org
 - clone svn to tmp/
 - download to trunk/
 - copy assets from .wordpress.org/ > tmp/svn-repo/assets/
 - add/rm/...
 - svn cp trunk/ tags/x.y.z/
 - svn ci -m "release x.y.z"
 - rm -rf tmp/

*/

// upgrade plugin version
// console.log(wp.find_package_files())
// wp.write_header_tag( wp.find_package_file(), 'Version', version );
// try {
// 	wp.write_header_tag( './readme.txt', 'Stable tag', version );
// } catch {
// 	console.log('no readme.txt')
// }
