import { useState, useEffect } from "react";

import info from '../../assets/images/info.svg'
import infoFocus from '../../assets/images/info-focus.svg'
import infoDisabled from '../../assets/images/info-disabled.svg'
import selector from '../../assets/images/selector.svg'
import selectorFocus from '../../assets/images/selector-focus.svg'
import selectorDisabled from '../../assets/images/select-disabled.svg'
import beamTemp from '../../assets/images/universal-beam.svg'
import columnTemp from '../../assets/images/universal-column.svg'
import channelTemp from '../../assets/images/parallel-flange-channel.svg'
import heightTag from '../../assets/images/height-tag.svg'
import widthTag from '../../assets/images/width-tag.svg'
import massTag from '../../assets/images/mass-tag.svg'
import areaTag from '../../assets/images/area-tag.svg'
import flangeTag from '../../assets/images/flange-tag.svg'
import webTag from '../../assets/images/web-tag.svg'
import radiusTag from '../../assets/images/radius-tag.svg'
import depthTag from '../../assets/images/depth-tag.svg'

function ListItem() {
    const [inputValue, setInputValue] = useState(['']);
    const [steelSections, setSteelSections] = useState([]);
    const [selectedMember, setSelectedMember] = useState([]);
    const [collapsedSections, setCollapsedSections] = useState([]);
    const [profileExpanded, setProfileExpanded] = useState(-1)
    const [infoExpanded, setInfoExpanded] = useState(-1)
    const [colorExpanded, setColorExpanded] = useState(-1)
    const [selectedColor, setSelectedColor] = useState(['#FFFACD'])
    const [items, setItems] = useState(['B1'])

    const colors = [
        "#FFFACD", "#FFB6C1", "#98FB98", "#ADD8E6", "#FFD700", "#B19CD9",
        "#FF6961", "#AFEEEE", "#FFB5C5", "#E0FFFF", "#DFFF00", "#9CADD8",
        "#FFDAB9", "#E6E6FA", "#FF7F50", "#AFEEEE", "#98FF98", "#FDD5B1"
      ]

    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/data');
        const data = await response.json();
        setSteelSections(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const handleProfileFocus = (index) => {
        if (profileExpanded === index) {
            setProfileExpanded(-1)
        } else if (infoExpanded !== -1 || colorExpanded !== -1) {
            setInfoExpanded(-1)
            setColorExpanded(-1)
            setTimeout(() => {
                setProfileExpanded(index)
            }, 400)
        } else {
            setProfileExpanded(index)
        }
    }
  
    const handleInputChange = (event, index) => {
        const updatedValue = [...inputValue]
        updatedValue[index] = event.target.value
        setInputValue(updatedValue);
        setSelectedMember([]);
    };
    
    const toggleSection = (type) => {
        if (collapsedSections.includes(type)) {
            setCollapsedSections(collapsedSections.filter((collapsedType) => collapsedType !== type))
        } else {
            setCollapsedSections([...collapsedSections, type])
        }
    }

    const handleMemberSelection = (member, index) => {
        const selectedSection = steelSections.find((steelType) =>
          steelType.sections.some((section) => section.name === member)
        );
      
        if (selectedSection) {
            const selectedSectionObject = selectedSection.sections.find(
            (section) => section.name === member
          );
      
          
            const updatedValue = [...inputValue];
            updatedValue[index] = member;
            setInputValue(updatedValue);
            const updatedMembers = [...selectedMember]
            updatedMembers[index] = selectedSectionObject  
            setSelectedMember(updatedMembers);
            setProfileExpanded(-1);
        } else {
          setSelectedMember([]);
        }
      };
      

    const handleChange = (index, event) => {
        const { value } = event.target;
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
      };

    const handleInfoClick = (index) => {
        if (infoExpanded === index) {
            setInfoExpanded(-1)
        } else if (profileExpanded !== -1 || colorExpanded !== -1) {
            setProfileExpanded(-1)
            setColorExpanded(-1)
            setTimeout(() => {
                setInfoExpanded(index)
            }, 400)
        } else {
            setInfoExpanded(index)
        }
    }

    const handleColorClick = (index) => {
        if (colorExpanded === index) {
            setColorExpanded(-1)
        } else if (profileExpanded !== -1 || infoExpanded !== -1) {
            setProfileExpanded(-1)
            setInfoExpanded(-1)
            setTimeout(() => {
                setColorExpanded(index)
            }, 400);
        } else {
            setColorExpanded(index)
        }
    }

    const handleColorSelect = (index, color) => {
        const newColors = [...selectedColor]
        newColors[index] = color
        setSelectedColor(newColors)
    }
    
      const addItem = () => {
        const lastItem = items[items.length - 1];
        let prefix = '';
        let lastValue = 0;
    
        for (let i = 0; i < lastItem.length; i++) {
          if (isNaN(parseInt(lastItem[i]))) {
            prefix += lastItem[i];
          } else {
            lastValue = parseInt(lastItem.substring(i));
            break;
          }
        }
    
        const newItem = `${prefix}${lastValue + 1}`;
        const previousColorIndex = selectedColor.length - 1;
        const newColorIndex = (previousColorIndex + 1) % colors.length;
        const newColor = colors[newColorIndex];
      
        setItems([...items, newItem]);
        setSelectedColor([...selectedColor, newColor]);
      };

    return (
        <div>
            <ul className="fade">
                {items.map ((item, index) => (
                    <li 
                        key={index} 
                        className={`list-element 
                            ${profileExpanded === index ? 'profile-expanded' : ''}
                            ${infoExpanded === index ? 'info-expanded' : ''}
                            ${colorExpanded === index ? 'color-expanded' : ''}
                        `}
                    >
                        <div className="container">
                            <form className="identifier">
                                <input 
                                    type="text"
                                    value={item}
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </form>
                            <form className="profile">
                                <input 
                                    type="text"
                                    placeholder="Profile..."
                                    value={inputValue[index]}
                                    onChange={(event) => handleInputChange(event, index)}
                                    onFocus={() => handleProfileFocus(index)}
                                />
                            </form>
                            <button className="info" onClick={() => handleInfoClick(index)} disabled={!selectedMember[index]}>
                                {selectedMember[index] ? (infoExpanded !== index ? <img src={info} alt="info"/> : <img src={infoFocus} alt="info"/>) : <img src={infoDisabled} alt="info"/>}
                            </button>
                            <div className="color-picker" onClick={() => handleColorClick(index)}>
                                <button className="color" style={{backgroundColor: selectedColor[index]}}></button>
                            </div>
                            <button className="select" disabled={!selectedMember[index]}>
                                {selectedMember[index] ? <img src={selector} alt="select"/> : <img src={selectorDisabled} alt="select-disabled"/>}
                            </button>
                        </div>
                        {(selectedMember[index] === null || selectedMember[index] === undefined) && profileExpanded === index && (
                        <div className="profile-dropdown">
                            {steelSections.map((steelType) => {
                                const {type, sections } = steelType;
                                const filteredSections = sections.filter((section) =>
                                    section.name && section.name.toLowerCase().startsWith(inputValue[index]?.toLowerCase() || '')
                                );

                                const isCollapsed = collapsedSections.includes(type)
                                if (filteredSections.length > 0) {
                                    return (
                                        <div key={type}>
                                            <button onClick={() => toggleSection(type)}>
                                                {type} {isCollapsed ? '+' : '-'}
                                            </button>
                                            {!isCollapsed && (
                                                <ul>
                                                    {filteredSections.map((section) => {
                                                        const { name } = section;
                                                        return (
                                                            <li key={name} onClick={() => handleMemberSelection(name, index)}>
                                                                {name}
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        )}
                        {infoExpanded === index && (
                        <div className="info-dropdown">
                            {selectedMember[index].name.includes('UB') && <img src={beamTemp} alt='beam'/>}
                            {selectedMember[index].name.includes('UC') && <img src={columnTemp} alt='column'/>}
                            {selectedMember[index].name.includes('PFC') && <img src={channelTemp} alt='channel'/>}
                            <div className="info-table">
                                <div className="height">
                                    <img src={heightTag} alt="height"/>
                                    <p>{`${selectedMember[index].depth} mm`}</p>
                                </div>
                                <div className="width">
                                    <img src={widthTag} alt="width"/>
                                    <p>{`${selectedMember[index].width} mm`}</p>
                                </div>
                                <div className="mass">
                                    <img src={massTag} alt="mass"/>
                                    <p>{`${selectedMember[index].weight} kg/m`}</p>
                                </div>
                                <div className="area">
                                    <img src={areaTag} alt="area"/>
                                    <p>{`${selectedMember[index].area} m${'\u00B2'}/m`}</p>
                                </div>
                                <div className="flange">
                                    <img src={flangeTag} alt="flange"/>
                                    <p>{`${selectedMember[index].flange} mm`}</p>
                                </div>
                                <div className="web">
                                    <img src={webTag} alt="web"/>
                                    <p>{`${selectedMember[index].web} mm`}</p>
                                </div>
                                <div className="radius">
                                    <img src={radiusTag} alt="radius"/>
                                    <p>{`${selectedMember[index].radius} mm`}</p>
                                </div>
                                <div className="depth">
                                    <img src={depthTag} alt="depth"/>
                                    <p>{`${selectedMember[index]['depth-between']} mm`}</p>
                                </div>
                            </div>
                        </div>
                        )}
                        {colorExpanded === index && (
                            <div className="color-dropdown">
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[0])} style={{ backgroundColor: "#FFFACD" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[1])} style={{ backgroundColor: "#FFB6C1" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[2])} style={{ backgroundColor: "#98FB98" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[3])} style={{ backgroundColor: "#ADD8E6" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[4])} style={{ backgroundColor: "#FFD700" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[5])} style={{ backgroundColor: "#B19CD9" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[6])} style={{ backgroundColor: "#FF6961" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[7])} style={{ backgroundColor: "#AFEEEE" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[8])} style={{ backgroundColor: "#FFB5C5" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[9])} style={{ backgroundColor: "#E0FFFF" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[10])} style={{ backgroundColor: "#DFFF00" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[11])} style={{ backgroundColor: "#9CADD8" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[12])} style={{ backgroundColor: "#FFDAB9" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[13])} style={{ backgroundColor: "#E6E6FA" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[14])} style={{ backgroundColor: "#FF7F50" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[15])} style={{ backgroundColor: "#AFEEEE" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[16])} style={{ backgroundColor: "#98FF98" }}></button>
                                </div>
                                <div className="color-highlighter">
                                    <button onClick={() => handleColorSelect(index, colors[17])} style={{ backgroundColor: "#FDD5B1" }}></button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={addItem} className="add-item">+</button>
        </div>
    )
}

export default ListItem