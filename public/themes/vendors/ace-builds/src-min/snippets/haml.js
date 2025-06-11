define("ace/snippets/haml",["require","exports","module"],function(e,t,n){"use strict";t.snippetText="snippet t\n	%table\n		%tr\n			%th\n				${1:headers}\n		%tr\n			%td\n				${2:headers}\nsnippet ul\n	%ul\n		%li\n			${1:item}\n		%li\nsnippet =rp\n	= render :partials => '${1:partials}'\nsnippet =rpl\n	= render :partials => '${1:partials}', :locals => {}\nsnippet =rpc\n	= render :partials => '${1:partials}', :collection => @$1\n\n",t.scope="haml"});                (function() {
                    window.require(["ace/snippets/haml"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            