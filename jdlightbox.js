
var JDLightbox = new Class({

	Implements: [Options],

	options: {
		'selector': 'a[data-jdlightbox=jdlightbox]'
	},

	initialize:  function(options) { 
		this.setOptions(options);
		var that = this;
		
		this.bg = new Element("div.jdlightbox_modal_bg");
		this.fig = new Element("figure");
		
		this.bg.fade('hide');
		
		this.bg.addEvent('click', function(){
			that.bg.fade('out');
		})
		
		$$( this.options.selector ).addEvent('click', function(e,i,x){
			that.fig.getChildren().destroy();
			that.fig.adopt( new Element('img',{ 'src': this.get('href') }) )
			that.fig.adopt( new Element('figcaption',{ 'text': this.get('title') }) )
			that.bg.fade('in');
			e.preventDefault();
		});
		
		this.bg.grab(this.fig);
		
		$$('body').grab( this.bg );
		
	}
	
});