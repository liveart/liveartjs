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

	//LESS rebuild CSS files
	grunt.registerTask('rebuildcss', ['less:production', 'copy:css', 'clean:css']);
};