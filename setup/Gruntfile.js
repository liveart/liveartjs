module.exports = function(grunt) {
	grunt.initConfig({
		// copy styles to /Release folder
		copy: {
			css: {
				files: [
					{
						expand: true,
						cwd: '',
						src: [
							'assets/**/*.css'
						],
						dest: '../.',
						filter: 'isFile'
					}
				],
			},
		},

		// cleaning css files
		clean: {
			css: ["assets/**/*.css"]
		},

		less: {
            production: {
            	//convert all less files at the same place as source
                files: [{
                	expand: true,
					src: ['assets/**/*.less', '!**/*.config.less'],
					dest: '.',
					ext: '.css'
                }],
                options: {
                	dumpLineNumbers: "comments",
                	compress: true,
                	strictImports: true
                }
            }
        }
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');

	// Custom task to generate javascript file with all constants from .less file
	grunt.registerTask('exportLessVars', function () {
		var configJS = "assets/js/resize.less.js";
		var configLess = "assets/css/variables.config.less";
		var varGlobName = "laLessConst";
		var less = grunt.file.read(configLess);
		var variables = less.match(/@[\w-_]+:\s*.*;[\/.]*/gm);
		var scriptText = "/** Auto-generated file with const's from less */\n\n";
		scriptText += "var " + varGlobName + " = { }\n";
		variables.forEach(function (variable){
			var parts = variable.match(/@(.*):(.*);/);
			var varName = varGlobName + "." + parts[1];
			var varValue = parts[2];
			varValue = varValue.replace("max(", "Math.max(");
			varValue = varValue.replace("min(", "Math.min(");
			varValue = varValue.replace(/\s|px/g, "");
			varValue = varValue.replace(/@/g, varGlobName + ".");
			//color
			if (varValue.match(/#(?:[0-9A-Fa-f]{3}){1,2}/g)) {
				varValue = "\"" + varValue + "\"";
			}
			scriptText += "" + varName + " = " + varValue + ";\n"
		});
		grunt.file.write(configJS, scriptText);
	});

	//LESS rebuild CSS files
	grunt.registerTask('rebuildcss', ['less:production', 'copy:css', 'clean:css', 'exportLessVars']);
};
