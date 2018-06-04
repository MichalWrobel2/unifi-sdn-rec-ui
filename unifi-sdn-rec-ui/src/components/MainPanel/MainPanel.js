import Draggable from 'react-draggable';
import React from 'react';
import './MainPanel.css';

class MainPanel extends React.Component {
	constructor() {
		super();
		this.state = {
			areaBounds: null,
			routerCoords: { x: 0, y: 0 },
			scaleFactor: 1,
			imageSize: 192 * 0.5,
			scalableElements: {
				areaSignal: -80,
				antennaGain: 1,
				dotSize: 10
			}
		};

		this.areaRef = React.createRef();
		this.initialCoords = [];
		this.RECEIVERS_COUNT = 10;
	}
	componentDidUpdate(prevProps) {
		this.updateOnProps(prevProps);
	}
	componentDidMount() {
		this.getWindowSizeAndExec(() => this.setState({ receivers: this.generateReceivers(this.RECEIVERS_COUNT) }));
		window.addEventListener('resize', this.handleResize.bind(this));
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize.bind(this));
	}
	updateOnProps(prevProps) {
		const { x, y } = this.state.routerCoords;
		const { range } = this.props.setup;
		const { x: areaX, y: areaY } = this.state.areaBounds;
		let updatedState = {};
		if (prevProps.range < this.props.range) {
			const { x: clientWidth, y: clientHeight } = this.state.areaBounds;

			const overlap = (axis) => {
				const screenDimension = axis === 'x' ? clientWidth : clientHeight;
				const position = axis === 'x' ? x : y;

				const newDistance = screenDimension - position - this.props.range;

				return newDistance < 0 ? (position + newDistance) : position;
			}
			updatedState.routerCoords = { x: overlap('x'), y: overlap() };
		}
		if (prevProps.scale !== this.props.scale) {
			const scaleFactor = this.props.scale / prevProps.scale;
			const updatedReceiversCoords = this.state.receivers.map((receiver, index) => {

				const newReceiver = { x: this.state.receivers[index].x * scaleFactor, y: this.state.receivers[index].y * scaleFactor };

				return newReceiver;
			});
			updatedState = {
				scaleFactor: scaleFactor,
				receivers: updatedReceiversCoords,
				scalableElements: {
					areaSignal: -80 * scaleFactor,
					antennaGain: 1 * scaleFactor,
					dotSize: this.state.scalableElements.dotSize * scaleFactor
				}
			}

		}
		this.areaRef.current.scrollTo(x - (areaX / 2) + (range / 2), y - (areaY / 2) + (range / 2));
		if (Object.keys(updatedState).length) {

			this.setState(updatedState);
		}
	}
	getWindowSizeAndExec(action) {
		const { clientHeight, clientWidth } = this.areaRef.current;
		this.setState({ areaBounds: { x: clientWidth, y: clientHeight } }, action);
	}
	handleResize() {
		if (this.props.scale !== 1) {

			return;
		}
		this.getWindowSizeAndExec(() => {
			const range = this.props.range;
			const routerCoords = this.state.routerCoords;
			const newCoords = [];
			this.state.receivers.map((receiver, index) => {

				return newCoords.push(this.correctOverlapping(receiver, this.state.scalableElements.dotSize, index));
			});
			this.setState({
				receivers: newCoords,
				routerCoords: this.correctOverlapping(routerCoords, range)
			});
		});
	}
	handleStart() {
		const { range, scaleFactor } = this.props.setup;
		const rsRatio = range / scaleFactor;
		this.props.data({ scaleFactor: 1, range: rsRatio });
	}
	handleDrag(_, { x, y }) {

		this.setState({ routerCoords: { x, y } });
	}
	handleStop() {
		const { x, y } = this.state.routerCoords;
		const { range, scaleFactor } = this.props.setup;
		this.setState({ routerCoords: { x: x * scaleFactor, y: y * scaleFactor } })
		this.props.data({ scaleFactor: scaleFactor, range: range });
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

			return this.correctOverlapping({ x: Math.floor(Math.random() * x), y: Math.floor(Math.random() * y) }, this.state.scalableElements.dotSize);
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

		return Math.hypot((receiverCoords.x + this.state.scalableElements.dotSize / 2) - (routerCoords.x + this.props.range / 2) , (receiverCoords.y + this.state.scalableElements.dotSize / 2) - (routerCoords.y + this.props.range / 2));
	}
	isCovered(index) {

		return this.calculateCoverageOfPoint(this.state.routerCoords, this.state.receivers[index]);
	}

	calculateCoverageOfPoint(routerCoords, receiverCoords) {

		const distance = this.calculateDistance(routerCoords, receiverCoords);
		// const pathLoss = 20 * Math.log10(distance / 1000) + 20 * Math.log10(setup.radio) + 92.45;

		return distance <= this.props.range / 2 + this.state.scalableElements.dotSize / 2;
	}
	render() {
		const routerImagePosPerc = 100 - ( this.state.imageSize * 100 / this.props.range);

		const receriversToRender = !this.isReceiverGenerated() || Object.values(this.state.receivers).map((receiver, index) => {
			const receiverStyle = {
				height: this.state.scalableElements.dotSize,
				width: this.state.scalableElements.dotSize,
				left: receiver.x,
				top: receiver.y,
				backgroundColor: this.isCovered(index) ? 'green' : 'red'
			};

			return <div key = {index} className = 'Receiver' style = {receiverStyle}></div>
		});
		const imageStyle = {
			display: this.state.imageSize < this.props.range ? 'block' : 'none',
			width: this.state.imageSize,
			height: this.state.imageSize,
			left: `calc(${routerImagePosPerc}% - ${(this.props.range - this.state.imageSize) / 2}px)`,
			top: `calc(${routerImagePosPerc}% - ${(this.props.range - this.state.imageSize) / 2 }px)`
		};
		const coverageStyle = {
			height: `${this.props.range}px`,
			width: `${this.props.range}px`,
			borderRadius: '50%'
		};
		const panelStyle = {
			width: this.state.areaBounds && this.state.areaBounds.hasOwnProperty('x') ? `calc(${this.state.areaBounds.x}px * ${this.props.scale})` : 'none',
			height: this.state.areaBounds && this.state.areaBounds.hasOwnProperty('y') ? `calc(${this.state.areaBounds.y}px * ${this.props.scale})` : 'none'
		}
		const rangeStyle = {
			width: this.props.range,
			height: this.props.range
		}

		return(

			<div className = 'MainPanel'
				ref = {this.areaRef}
				setup = {this.props.setup}
				field = {this.props.range}>
				
				<div className = 'MainPanel-area'
					style = {panelStyle}>
					<Draggable
						axis = 'both'
						handle = '.Router-handle'
						bounds = 'parent'
						position = {this.state.routerCoords}
						onStart = {this.handleStart.bind(this)}
						onDrag = {this.handleDrag.bind(this)}
						onStop = {this.handleStop.bind(this)}>
						<div className = 'Router-handle' style = {rangeStyle}>
							<div className = 'MainPanel-coverageArea' style = {coverageStyle}>
								<div></div>
								<img style = {imageStyle}
									className = 'Router-image'
									draggable = 'false'
									src = 'https://unifi-hd.ubnt.com/5b30823e7da7b814bb226a9fc0802a19.png'
									alt = 'Acces Point'/>
							</div>
						</div>
					</Draggable>
				</div>
				{ this.isReceiverGenerated() && receriversToRender }
			</div>
		)
	}
}

export default MainPanel;