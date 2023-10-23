/** Author: Salim Choura
*   Course: csc337
*   Description: This file handles sending the requests
*                sent to our server.
*/

document.getElementById('my_button').onclick = clickHandler

/**
 * This function sends a post request to our server everytime
 * a user sends a message. This message is saved to our database
 */
function clickHandler()
{
    // getting the alias and message and resetting the message
    let alias = document.getElementById('alias').value
    let message = document.getElementById('message').value
    document.getElementById('message').value = ''
    let object = {}
    object['alias'] = alias
    object['message'] = message
    let data = JSON.stringify(object)

    let url = 'http://localhost:80/chats/post'

    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Error!');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                console.log('request sent');
            } else { alert('ERROR'); }
        }
    }

    // sending the post request along with the JSON object containing our
    // alias and message
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send(data);
}

window.setInterval(getChats, 1000)


/**
 * This function is called every second to make a get
 * request to the server requesting an up-to-date version
 * of the database. The function then updates the chat
 * record in the front end by using the up-to-date database.
 */
function getChats()
{
    let url = `http://localhost:80/chats`

    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Error!');
        return false;
    }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) 
            {
                // if the request is successful, we update the top div
                // of our html file with our up-tp-date database
                let top = document.getElementById('top')
                let break_line1 = document.createElement('br')
                let break_line2 = document.createElement('br')
                let break_line3 = document.createElement('br')
                top.innerHTML = ''
                top.appendChild(break_line1)
                top.appendChild(break_line2)
                top.appendChild(break_line3)
                let data = JSON.parse(httpRequest.responseText)
                console.log(data)
                for (let i=0; i<data.length;i++)
                {
                    // making the alias its own span element (same for the message)
                    // then adding a creating a line break and appending everything to the
                    // top of the page.
                    let alias_span = document.createElement('span');
                    alias_span.classList += 'alias';
                    alias_span.textContent = `${data[i]['alias']}: `;
                    let message_span = document.createElement('span');
                    message_span.classList += 'message';
                    message_span.textContent = `${data[i]['message']} `;
                    let break_line4 = document.createElement('br')
                    let break_line5 = document.createElement('br')
                    top.appendChild(alias_span)
                    top.appendChild(message_span)
                    top.appendChild(break_line4)
                    top.appendChild(break_line5)
                }
            } else { alert('ERROR'); }
        }
    }
    // making the request.
    httpRequest.open('GET', url);
    httpRequest.send();
}