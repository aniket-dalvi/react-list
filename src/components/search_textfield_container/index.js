import React, {useState} from "react";
import "./styles.css";

function addNewFriend(name, friendList) {
    return friendList
        ? [...friendList, { name, fav: false }]
        : [{ name, fav: false }];
}

function TextFieldContainer(props) {
    const [friendName, setFriendName] = useState("");

    const onKeyPress = (e) => {
        if (e.key === "Enter") {
            if (friendName) {
                const existingUser = props?.list?.findIndex(
                    (result) => result.name.toLowerCase() == friendName.toLowerCase()
                );
                if(props.list) {
                    if (existingUser) {
                        const list = addNewFriend(friendName, props.list);
                        localStorage.setItem("list", JSON.stringify(list));
                        props.getList(list, true);
                        setFriendName("");
                    } else {
                        alert("This friend already exist in your list.");
                    }
                } else {
                    const list = addNewFriend(friendName, props.list);
                    localStorage.setItem("list", JSON.stringify(list));
                    props.getList(list, true);
                    setFriendName("");
                }
            } else {
                alert("Please enter friend name.");
            }
        }
    };

    const onChangeText = (name) => {
        setFriendName(name);
        if (name) {
            const searchedArr = props.list?.filter((result) =>
                result.name.toLowerCase().includes(name.toLowerCase())
            );
            props.getList(searchedArr);
        } else {
            props.resetList(false);
        }
    };

    return (
        <div className="textfield-wrapper">
            <label className="header">Friends List</label>
            <input
                placeholder="Enter your friend's name"
                value={friendName}
                onKeyPress={(e) => onKeyPress(e)}
                onChange={(e) => onChangeText(e.target.value)}
            />
        </div>
    );
}

export default TextFieldContainer;
