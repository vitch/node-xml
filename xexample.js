var sys = require('sys'),
	xxml = require('./lib/node-xxml');

xxml.parseXml(
	'flickr1.xml',
	function(o)
	{
		//sys.puts(sys.inspect(o));
		sys.puts(o.rsp._stat);
		sys.puts(o.rsp.photos._total);
		sys.puts(o.rsp.photos.photo[0]._id);
	} 
)	
