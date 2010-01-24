var sys = require('sys'),
	xxml = require('./lib/node-xxml');

xxml.parseXml(
	'flickr1.xml',
	function(o)
	{
		//sys.puts(sys.inspect(o));
		sys.puts(o.rsp['@stat']);
		sys.puts(o.rsp.photos['@total']);
	} 
)	
