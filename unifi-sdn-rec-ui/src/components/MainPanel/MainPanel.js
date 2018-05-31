import Draggable from 'react-draggable';
import React from 'react';
import Scale from '../Scale/Scale.js';
import './MainPanel.css';

class MainPanel extends React.Component {
	constructor() {
		super();
		this.state = {
			areaBounds: null,
			routerCoords: { x: 0, y: 0 }
		};

		this.areaRef = React.createRef();
		this.initialCoords = [];
		this.AREA_SIGNAL = -80;
		this.CLIENT_ANTENNA_GAIN = 1;
		this.DOT_SIZE = 10;
		this.IMAGE_SIZE = 192 * 0.5;
		this.RECEIVERS_COUNT = 10;
	}
	componentDidUpdate(prevProps) {

		if (prevProps.range < this.props.range) {
			const { clientHeight, clientWidth } = this.areaRef.current;
			const { x, y } = this.state.routerCoords;
			const overlap = (axis) => {
				const screenDimension = axis === 'x' ? clientWidth : clientHeight;
				const position = axis === 'x' ? x : y;

				const newDistance = screenDimension - position - this.props.range;

				return newDistance < 0 ? (position + newDistance) : position;
			}

			this.setState({ routerCoords: { x: overlap('x'), y: overlap() } })
		}
	}
	componentDidMount() {
		this.getWindowSizeAndExec(() => this.setState({ receivers: this.generateReceivers(this.RECEIVERS_COUNT) }));
		window.addEventListener('resize', this.handleResize.bind(this));
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize.bind(this));
	}
	getWindowSizeAndExec(action) {
		const { clientHeight, clientWidth } = this.areaRef.current;
		this.setState({ areaBounds: { x: clientWidth, y: clientHeight } }, action);
	}
	handleResize() {
		this.getWindowSizeAndExec(() => {
			const range = this.props.range;
			const routerCoords = this.state.routerCoords;
			const newCoords = [];
			this.state.receivers.map((receiver, index) => {

				return newCoords.push(this.correctOverlapping(receiver, this.DOT_SIZE, index));
			});
			this.setState({
				receivers: newCoords,
				routerCoords: this.correctOverlapping(routerCoords, range)
			});
		});
	}
	handleDrag(_, { x, y }) {
		this.setState({ routerCoords: { x, y } });
	}
	correctOverlapping(generatedCoords, objSize, index) {
		const size = objSize;
		const newCoords = generatedCoords;
		const { x, y } = this.state.areaBounds;

		if (generatedCoords.x >= x - size && generatedCoords.y >= y - size) {

			newCoords.x = generatedCoords.x - (generatedCoords.x - (x - size));
			newCoords.y = generatedCoords.y - (generatedCoords.y - (y - size));
		} else if (generatedCoords.x >= x - size) {

			newCoords.x = generatedCoords.x - (generatedCoords.x - (x - size));
		} else if (generatedCoords.y >= y - size) {

			newCoords.y = generatedCoords.y - (generatedCoords.y - (y - size));
		}

		if (this.initialCoords && typeof index !== 'undefined') {
			const { x: currentX, y: currentY } = this.state.receivers[index];
			const { x: initialX, y: initialY } = this.initialCoords[index];

			if (initialX > currentX && initialY > currentY) {
				newCoords.x = initialX > x ? (x - size) : initialX;
				newCoords.y = initialY > y ? (y - size) : initialY;
			} else if (initialX > currentX) {
				newCoords.x = initialX > x ? (x - size) : initialX;
			} else if (initialY > currentY) {
				newCoords.y = initialY > y ? (y - size) : initialY;
			}
		}

		return newCoords;
	}
	generateReceivers(num) {
		const { x, y } = this.state.areaBounds;

		const generatedCoords = Array.from({ length: num }, () => {

			return this.correctOverlapping({ x: Math.floor(Math.random() * x), y: Math.floor(Math.random() * y) }, this.DOT_SIZE);
		});
		if (this.initialCoords.length <= this.RECEIVERS_COUNT) {
			generatedCoords.forEach((coords) => {
				this.initialCoords.push({ x: coords.x, y: coords.y })
			});
		}

		return generatedCoords;
	}
	isReceiverGenerated() {

		return this.state.receivers || 0;
	}
	calculateDistance(routerCoords, receiverCoords) {

		return Math.hypot((receiverCoords.x + this.DOT_SIZE / 2) - (routerCoords.x + this.props.range / 2) , (receiverCoords.y + this.DOT_SIZE / 2) - (routerCoords.y + this.props.range / 2));
	}
	isCovered(index) {

		return this.calculateCoverageOfPoint(this.state.routerCoords, this.state.receivers[index]);
	}

	calculateCoverageOfPoint(routerCoords, receiverCoords) {

		const setup = this.props.setup;
		const distance = this.calculateDistance(routerCoords, receiverCoords);
		const pathLoss = 20 * Math.log10(distance / 1000) + 20 * Math.log10(setup.radio) + 92.45;

		return setup.dropdown - pathLoss + this.CLIENT_ANTENNA_GAIN >= this.AREA_SIGNAL;
	}
	render() {

		const routerImagePosPerc = 100 - ( this.IMAGE_SIZE * 100 / this.props.range);
		const wrapperStyle = {
			minHeight: `calc(100% - ${this.props.range}px)`
		};

		const receriversToRender = !this.isReceiverGenerated() || Object.values(this.state.receivers).map((receiver, index) => {
			const receiverStyle = {
				height: this.DOT_SIZE,
				width: this.DOT_SIZE,
				left: receiver.x,
				top: receiver.y,
				backgroundColor: this.isCovered(index) ? 'green' : 'red'
			};

			return <div key = {index} className = 'Receiver' style = {receiverStyle}></div>
		});
		const imageStyle = {
			display: this.IMAGE_SIZE < this.props.range ? 'block' : 'none',
			width: this.IMAGE_SIZE,
			height: this.IMAGE_SIZE,
			left: `calc(${routerImagePosPerc}% - ${(this.props.range - this.IMAGE_SIZE) / 2}px)`,
			top: `calc(${routerImagePosPerc}% - ${(this.props.range - this.IMAGE_SIZE) / 2 }px)`
		};
		const coverageStyle = {
			height: `${this.props.range}px`,
			width: `${this.props.range}px`,
			borderRadius: '50%'
		};

		return(

			<div className = 'MainPanel'
				scale = {this.props.scale}
				ref = {this.areaRef}
				setup = {this.props.setup}
				field = {this.props.range}>
				<Draggable
					axis = 'both'
					handle = '.Router-handle'
					bounds = 'parent'
					position = {this.state.routerCoords}
					onDrag={this.handleDrag.bind(this)}>
					<div className = 'Router-handle' style = {{ width: this.props.range, height: this.props.range }}>
						<div className = 'MainPanel-coverageArea' style = {coverageStyle}>
							<img style = {imageStyle}
								className = 'Router-image'
								draggable = 'false'
								src = 'https://unifi-hd.ubnt.com/5b30823e7da7b814bb226a9fc0802a19.png'
								alt = 'Acces Point'/>
						</div>
					</div>
				</Draggable>
				{ this.isReceiverGenerated() && <div>{receriversToRender}</div> }
				<div className = 'Scale-wrapper' style = {wrapperStyle}></div>
				<Scale scale = {this.props.scale}/>
			</div>
		)
	}
}

export default MainPanel;