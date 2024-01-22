import styled from 'styled-components';

export const GraphContainer = styled.svg`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 10px;
  background-image:
    repeating-linear-gradient(0deg, #00000045, transparent 1px, transparent 1px, #00000008 10px),
    repeating-linear-gradient(90deg, #00000045, transparent 1px, transparent 1px, #00000008 60px);
  transition: background 1s ease;
`;

export const Line = styled.path`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  fill: ${props => props.fill || '#d0c4ff8f'};
  stroke: ${props => props.stroke || '#6E6BFF'};
  stroke-width: ${props => props.strokeWidth || '2'};
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
`;

export const CursorLine = styled.line`
  opacity: 0.5;
  stroke: #6E6BFF;
  stroke-width: 2px;
  stroke-dasharray: 3;
  stroke-linecap: round;
  pointer-events: none;
`;

export const ChartContainer = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border: 1px solid #ccc;
`;

export const Flex = styled.div`
  display:flex;
  justify-content:space-between;
`;

export const Text = styled.p`
    fill: var(--text-color);
    font-size: 13px;
    display:flex;
    justify-content: flex-start;
`;

export const Tooltip = styled(Text)`
position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  background-color: #ffffff;
  padding: 8px;
  border: 1px solid #000000;
  border-radius: 4px;
  z-index: 999;
`;

export const Title = styled(Text)`
    display: flex;
    justify-content: flex-start;
    font-size: 18px;
    margin-bottom:20px;
`;

export const YAxis = styled(Text)`
    height: ${(props) => props.height};
    display: flex;
    flex-direction:column;
    justify-content:space-between;
`;

export const XAxis = styled(Text)`
  display:flex;
  justify-content:space-between;
`;

export const Column = styled(Text)`
display: flex;
flex-direction:column;
justify-content:space-between;
`;

---

import React, { useState } from "react";
import * as Styled from './style';

export function LineGraphic({ title, maxX, maxY, dataPoints, width = "100%", height = "180px", xAxis = [], yAxis = [] }) {
    const [cursorX, setCursorX] = useState(null);
    const [tooltipValue, setTooltipValue] = useState(null);

    const scaleX = (x, containerWidth) => (x / maxX) * containerWidth;
    const scaleY = (y, height) => ((maxY - y) / maxY) * height;

    const dataPointsWithPadding = [
        { x: dataPoints[0].x - 1, y: 0 },
        ...dataPoints,
        { x: dataPoints[dataPoints.length - 1].x + 1, y: 0 }
    ];

    const handleMouseMove = (event, containerWidth, containerHeight) => {
        const mouseX = event.nativeEvent.offsetX;
        setCursorX(mouseX);

        const xValue = (mouseX / containerWidth) * maxX;
        const closestDataPoint = dataPointsWithPadding.reduce((closest, point) => {
            return Math.abs(point.x - xValue) < Math.abs(closest.x - xValue) ? point : closest;
        });

        setTooltipValue(closestDataPoint.y);
    };

    const handleMouseLeave = () => {
        setCursorX(null);
        setTooltipValue(null);
    };

    const generatePath = (containerWidth, containerHeight) => {
        if (dataPointsWithPadding.length < 2) return '';

        let path = `M${scaleX(dataPointsWithPadding[0].x, containerWidth)} ${scaleY(dataPointsWithPadding[0].y, containerHeight)}`;

        for (let i = 1; i < dataPointsWithPadding.length; i++) {
            const point = dataPointsWithPadding[i];
            const controlX = scaleX((dataPointsWithPadding[i - 1].x + point.x) / 2, containerWidth);
            const controlY = scaleY((dataPointsWithPadding[i - 1].y + point.y) / 2, containerHeight);

            path += `Q${controlX} ${controlY}, ${scaleX(point.x, containerWidth)} ${scaleY(point.y, containerHeight)}`;
        }
        return path;
    };

    return (
        <div>
            <Styled.Title>{`${title} ${tooltipValue}`}</Styled.Title>
            <Styled.Flex>
                <Styled.YAxis height={height}>
                    {yAxis.map((value, index) => (
                        <Styled.Text key={index}>{value}</Styled.Text>
                    ))}
                </Styled.YAxis>
                <Styled.Column>
                    <Styled.GraphContainer
                        width={width}
                        height={height}
                        onMouseMove={(e) => handleMouseMove(e, parseInt(width, 10), parseInt(height, 10))}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Styled.Line
                            width={width}
                            height={height}
                            fill='#d0c4ff8f'
                            stroke='#6E6BFF'
                            strokeWidth='2'
                            filter='drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))'
                            d={generatePath(parseInt(width, 10), parseInt(height, 10))}
                        />
                        {cursorX !== null && (
                            <Styled.CursorLine x1={cursorX} x2={cursorX} y1="0" y2="100%" />
                        )}
                    </Styled.GraphContainer>
                    <Styled.Flex>
                        {xAxis.map((value, index) => (
                            <Styled.Text key={index}>{`${value}`}</Styled.Text>
                        ))}
                    </Styled.Flex>
                </Styled.Column>
            </Styled.Flex>
        </div>
    );
}

//Usage

    const temperatureData = [
        { x: 0, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 8 },
        { x: 3, y: 5 },
        { x: 4, y: 10 },
        { x: 5, y: 7 },
        { x: 6, y: 7 },
        { x: 7, y: 2 },
        { x: 8, y: 3 },
        { x: 9, y: 3 },
        { x: 10, y: 1 },
        { x: 11, y: 2 },
        { x: 12, y: 1 },
        { x: 13, y: 1 },
        { x: 14, y: 1 },
    ];

                    <LineGraphic 
                        title={"Precipitation chance"}
                        maxX={4} maxY={10}
                        dataPoints={temperatureData}
                        xAxis={["00", "06", "12", "18", "24"]}
                        yAxis={["0%","25%","50%","75%","100%"]}
                    />
