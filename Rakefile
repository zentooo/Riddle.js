closure_command = "closure "
jsfiles = Dir.glob("./src/*.js").reject { |f| f =~ /min/ }
jsdoc_path = ENV["HOME"] + "/Dropbox/jsdoc-toolkit"

task :default => [:build, :build_all, :doc, :show]

task :build do
  sh closure_command + "--js ./src/riddle.js > ./src/riddle.min.js"
end

task :build_all do
  sh closure_command + jsfiles.map { |f| "--js " + f }.join(" ") + " > src/riddle-all.min.js"
end

task :doc do
  sh "rm -rf ./doc/*"
  sh "java -jar #{jsdoc_path}/jsrun.jar #{jsdoc_path}/app/run.js -a -t='#{jsdoc_path}/templates/jsdoc' " + jsfiles.join(" ") + " -d=./doc"
  sh "git add 'doc/*'"
end

task :show do
  sh "ls -lh ./src"
end
