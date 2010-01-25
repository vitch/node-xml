var sys = require('sys'),
	xxml = require('./lib/node-xxml');

xxml.parseXmlFile(
	'flickr1.xml',
	function(o)
	{
		sys.puts('xxml.parseXmlFile');
		//sys.puts(sys.inspect(o));
		sys.puts(o.rsp._stat);
		sys.puts(o.rsp.photos._total);
		sys.puts(o.rsp.photos.photo[0]._id);
	} 
)

xxml.parseXmlString(
	'<?xml version="1.0" encoding="utf-8"?><rsp stat="ok"><photos page="1" pages="100" perpage="10" total="1000"><photo id="4299389475" owner="42430054@N04" secret="cf1ebf82be" server="4026" farm="5" title="IMG_2786" ispublic="1" isfriend="0" isfamily="0"/><photo id="4299389479" owner="32477043@N07" secret="fbdbba4fbe" server="4044" farm="5" title="IMG_1007 web" ispublic="1" isfriend="0" isfamily="0"/></photos></rsp>',
	function(o)
	{
		sys.puts('xxml.parseXmlString');
		//sys.puts(sys.inspect(o));
		sys.puts(o.rsp._stat);
		sys.puts(o.rsp.photos._total);
		sys.puts(o.rsp.photos.photo[0]._id);
	} 
)

xxml.parseXmlUrl(
	'http://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=e51bde86388c03cfb405ffc85e5e7f66',
	function(o)
	{
		sys.puts('xxml.parseXmlUrl');
		//sys.puts(sys.inspect(o));
		sys.puts(o.rsp._stat);
		sys.puts(o.rsp.photos._total);
		sys.puts(o.rsp.photos.photo[0]._id);
	} 
)
