import React, { Component } from 'react';
import './Main.css';
class Main extends Component {
	state = {	
				socket:null,
				keyword:'',
				data:[],
				id:'',
				startTime: '',
				videoid:'',
				search: false,
				IsFound:false,
				doSearch:false,
				key:1,
  	}

  	handleOnChange(e){
  		this.setState({keyword:e.target.value});
  	}

	handleSearch = (e) =>{
		if(this.state.keyword){
		e.preventDefault();
		this.setState({data:[],id:'',startTime:'',videoid:'',search:false,doSearch:true});

		if (!this.state.socket) {
      		alert("Error: There is no socket connection.");
      		return false;	
    	}
		this.state.socket.send(this.state.keyword);
		$("#myModal").modal()
		}
	}

	handleBack = (e) =>{
		e.preventDefault();
		if(this.state.id > 0){
			var i = this.state.id-1;		
			this.setState({id:i,videoid:this.state.data[i].videoid,startTime:this.state.data[i].startTime});
		}else{
			alert("Không còn clip ở trước!");
		}
	}

	handleNext = (e) =>{
		e.preventDefault();
		if(this.state.id < this.state.data.length-1){
			var i = this.state.id+1;
			this.setState({id:i,videoid:this.state.data[i].videoid,startTime:this.state.data[i].startTime});
		}
		else{
			alert("Không còn clip ở sau!");
		}
	}
	handleRefresh = (e) =>{
		e.preventDefault();
		this.setState({key:Math.random()});
	}
	handleHome = (e) =>{
	//		location.reload();
	this.setState({data:[],id:'',startTime:'',videoid:'',search:false,doSearch:true});
	}
	handleSend = (key) =>{
		this.setState({data:[],id:'',startTime:'',videoid:'',search:false,doSearch:true});
	  this.state.socket.send(key);
	}
	componentDidMount(){

		if (!window["WebSocket"]) {
    		alert("Error: Your browser does not support web sockets.")
  		} else {
    		const newsocket = new WebSocket("ws://54.169.254.135:3030/user");
    		this.setState({socket:newsocket})
    		newsocket.onopen = function(){
    		}
    		newsocket.onclose = (e) => {
      		alert("Connection has been closed. "+e.code);
    		}
    		
    		newsocket.onmessage = (e) => {
    			if (e.data==="NOT FOUND") {
    				this.setState({IsFound:true,doSearch:false})
    			}else{
    				var res = e.data.split(" ")
    			const nextdata=this.state.data.concat([{videoid:res[0],startTime:res[1]}]);
				this.setState({data:nextdata});
				if (!this.state.search) {
					this.setState({search:true,id:0,videoid:this.state.data[0].videoid,startTime:this.state.data[0].startTime,doSearch:false,IsFound:false});
				};	
    			}
    			
				
    		}			   	
  		}
	}

  render() {
    return (
		<div className="constain">
			<h1>{this.state.IsFound}</h1>
      		<div className="text-center">
				<div className="form-group has-success">
					<div className="intro-heading animated zoomIn">
					<hr/>
						<h1>English Go</h1>
					<hr/>
						<h5>Improve your English using Youtube</h5>
                    </div>
				</div>
				<form onSubmit={this.handleSearch}>
			  		<input type="text" className="form-group text" placeholder="Search for" required pattern="\S(.*\S)?" title="This field is required" onChange={(e)=> this.handleOnChange(e)} autoFocus/>
						<button type="submit"  className="button btn btn-lg animated infinite pulse">Say it</button>
				</form>
			</div>
					
			<div className="text-center">
				<h3> Top keyword: </h3>
				<p> 
						<a value="consciousness" data-toggle="modal" data-target="#myModal" onClick={(e) => this.handleSend("go")}>go</a>, 
						<a value="courage" data-toggle="modal" data-target="#myModal" onClick={(e) => this.handleSend("courage")}>courage</a>, 
						<a value="goals" data-toggle="modal" data-target="#myModal" onClick={(e) => this.handleSend("goals")}>goals</a>, 
						<a value="obama" data-toggle="modal" data-target="#myModal" onClick={(e) => this.handleSend("obama")}>obama</a>
				</p>
			</div>
	<div className="container">
  <div className="modal fade" id="myModal" role="dialog" data-keyboard="false" data-backdrop="static" >
    <div className="modal-dialog modal-lg">
 
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" onClick={this.handleHome}>&times;</button>
          <h4 className="modal-title">Improve your English using Youtube</h4>
        </div>
        <div className="modal-body">
					<div className={this.state.doSearch===false?'hidden':'text-center'}>
						<img src={require("../../img/loading.gif")} height="80" alt="device"/>
					</div>
				<div className={this.state.IsFound===false?'hidden':'text-center button'}>
						<h1> Not found! </h1>
				</div>
				<div className={this.state.search===false?'hidden':''}>
					<div className="html5-video-container youtube-clip">
					<iframe width="100%" className="video" 
						src={"http://www.youtube.com/embed/" + this.state.videoid + "?version=3&amp;hl=en_US&amp;&cc_load_policy=1;autoplay=1;start=" + parseInt(this.state.startTime,10)}
						frameBorder="0" allowFullScreen key={this.state.key}>
					</iframe>		
				</div>
				<div className="subvideo">
					<div className="col-md-3 col-sm-3 col-xs-3">
						<img src={require("../../img/back.png")} height="25" onClick={this.handleBack} alt="back"/>
					</div>
					<div className="col-md-3 col-sm-3 col-xs-3">
						<img src={require("../../img/home.png")} height="25" onClick={this.handleHome} alt="home"/>
					</div>
					<div className="col-md-3 col-sm-3 col-xs-3">
						<img src={require("../../img/refresh.png")} height="25" onClick={this.handleRefresh} alt="refresh" />
					</div>
					<div className="col-md-3 col-sm-3 col-xs-3">
						<img src={require("../../img/next.png")} height="25" onClick={this.handleNext} alt="next"/>
					</div>

				</div>		        
						</div>
					</div>
      </div>
      
    </div>
  </div>
  
</div>
						
				<section id="services col-md-8 col-sm-8 col-xs-8">
				<div className="container">
				<br/> <br/>
				<div className="row text-center">
					<div className="col-md-4">
						<img src={require("../../img/key.png")} height="50" alt="key"/>
						<h4 className="service-heading">Keyword</h4>
						<p className="text-muted">Search for all keywords<br/>
							Examples: consciousness, courage, goals, #obama</p>
					</div>
					<div className="col-md-4">
						<img src={require("../../img/device.png")} height="50" alt="device"/>
						<h4 className="service-heading">Device</h4>
						<p className="text-muted">Support for all devices</p>
					</div>
					<div className="col-md-4">
						<img src={require("../../img/support.png")} height="50" alt="support"/>
						<h4 className="service-heading">Support</h4>
						<p className="text-muted">Customer Support - 24/7 Live Chat, Ask a Question</p>
					</div>
				</div>
			</div>
    	</section>
    	
		<footer>
				<p className="copyright text-muted small text-center">Copyright &copy; Internship Group - <b>GPAT</b> 2016. All Rights Reserved</p>
		</footer>
    	</div>
    );
  }
}
export default Main;
