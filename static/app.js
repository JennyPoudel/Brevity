
function handleInputChange() {
    const rightSide = document.getElementById('right-side');
    const inputChoice = document.getElementById('input-choice').value;
    rightSide.innerHTML = ''; // Clear previous content

    if (inputChoice === 'option1') {
        rightSide.innerHTML = `
            <label for="input-text">Input Your Text:</label>
            <br />
            <textarea id="input-text"  name="input-text" rows="4" cols="50"></textarea>
            <br/>
            <label for="result-text">Summary:</label>
            <br />
            <textarea id="result-text" name="result-text" rows="4" cols="50"></textarea>
        `;
    } else if (inputChoice === 'option2') {
        rightSide.innerHTML = `
            <label for="link-text">Enter Link:</label>
            <br />
            <input type="text" id="link-text"  name="link-text" />
            </br>
            <label for="result-text">Summary:</label>
            <br />
            <textarea id="result-text" rows="4" cols="50"></textarea>
        `;
    }
    else if (inputChoice === 'option3') {
        rightSide.innerHTML = `
            <label for="link-text">Enter youtube Link:</label>
            <br />
            <input type="text" id="link-yt"  name="link-yt" />
            </br>
            <label for="result-text">Summary:</label>
            <br />
            <textarea id="result-text" rows="4" cols="50"></textarea>
        `;
    }
}
// function summarize() {
//     const summarizationType = document.getElementById('summarization-type').value;
//     const algorithmChoice = document.getElementById('algorithm-choice').value;
//     const summaryLength = document.getElementById('summary-length').value;
//     const languageChoice = document.getElementById('language-choice').value;
//     const inputText = document.getElementById('input-text').value;

//     // Define your summarization functions (abstractiveAlgorithm1, abstractiveAlgorithm2, etc.)

//     // Create a JSON object with the input data
//     const data = {
//         "input_text":inputText,
//         "percent":summaryLength // Update to use summaryLength
//     };
//     const data1 = {
//         "input_text":inputText,
        
//     };

//     // Make an AJAX request to the Flask route
//     fetch("http://127.0.0.1:5000/summarize", {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Display the result in the 'result-textarea'
//         const resultTextarea = document.getElementById('result-text');
//         resultTextarea.value = data.result;
//         console.log(resultTextarea.value)
//     });

//     fetch("http://127.0.0.1:5000/summarize_abs", {
//         method: "POST",
//         body: JSON.stringify(data1),
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Display the result in the 'result-textarea'
//         const resultTextarea = document.getElementById('result-text');
//         resultTextarea.value = data.result;
//         console.log(resultTextarea.value)
//     });
// }


function summarize() {
    const summarizationType = document.getElementById('summarization-type').value;
    const algorithmChoice = document.getElementById('algorithm-choice').value;
    const summaryLength = document.getElementById('summary-length').value;
    const languageChoice = document.getElementById('language-choice').value;
    //const youtube_link = document.getElementById('link-yt').value;
    // const inputText = document.getElementById('input-text').value;
    // const inputLink=document.getElementById('link-text').value;
    let data;

    if (algorithmChoice === 'algo3') {
        const inputLink=document.getElementById('link-text').value;
        data = {
            "input_link": inputLink
        };
    } else if (summarizationType === 'abs') {
        const inputText = document.getElementById('input-text').value;
        data = {
            "input_text": inputText
        };
        
    }  else if (algorithmChoice === 'algo2') {
        const inputlink = document.getElementById('link-yt').value;
        data = {
            "input_link": inputlink
        };
        
    }
    else {
        const inputText = document.getElementById('input-text').value;
        data = {
            "input_text": inputText,
            "percent": summaryLength
        };
    }

    // Define your summarization functions
    function abstractiveAlgorithm1() {
        // Your abstractive summarization logic
        return 'Abstractive Summarization using Algorithm 1';
    }

    function abstractiveAlgorithm2() {
        // Your abstractive summarization logic
        return 'Abstractive Summarization using Algorithm 2';
    }

    function abstractive_nltk(data) {
        print(data)
        fetch("http://127.0.0.1:5000/summarize_abs", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
       .then(response => response.json())
       .then(data => {
        // Display the result in the 'result-textarea'
        const resultTextarea = document.getElementById('result-text');
        resultTextarea.value = data.summary;
        console.log(resultTextarea.value)
    });

        
    }

     function extractive_nltk(data){
        fetch("http://127.0.0.1:5000/summarize", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
        // Display the result in the 'result-textarea'
        const resultTextarea = document.getElementById('result-text');
        resultTextarea.value = data.result;
        console.log(resultTextarea.value)
    });

}

    // function extractiveAlgorithm2() {
    //     // Your extractive summarization logic
    //     return 'Extractive Summarization using Algorithm 2';
    // }

    // function extractiveAlgorithm3() {
    //     // Your extractive summarization logic
    //     return 'Extractive Summarization using Algorithm 3';
    // }
    function extractive_nltk_link(data){
        console.log(data)
        fetch("http://127.0.0.1:5000/url_summary", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
        // Display the result in the 'result-textarea'
        const resultTextarea = document.getElementById('result-text');
        resultTextarea.value = data.result;
        console.log(resultTextarea.value)
    });

} 

function extractive_nltk_ytlink(data){
    
    fetch("http://127.0.0.1:5000/summarize_ext_yt", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(data => {
    // Display the result in the 'result-textarea'
    const resultTextarea = document.getElementById('result-text');
    resultTextarea.value = data.result;
    console.log(resultTextarea.value)
});

}


    // Perform summarization based on selected options
    let result = '';

    if (summarizationType === 'abs') {
        if (algorithmChoice === 'nltk') {
            result = abstractive_nltk(data); // Call your abstractive summarization function
        } else if (algorithmChoice === 'algo2') {
            result = abstractiveAlgorithm2(); // Call your abstractive summarization function
        } else if (algorithmChoice === 'algo3') {
            result = abstractiveAlgorithm3(); // Call your abstractive summarization function
        }
    } else if (summarizationType === 'ext') {
        if (algorithmChoice === 'nltk') {

            result = extractive_nltk(data); // Call your extractive summarization function
        }else if (algorithmChoice === 'algo3') {
            result = extractive_nltk_link(data); // Call your extractive summarization function
        }else if (algorithmChoice === 'algo2' ) {
            result = extractive_nltk_ytlink(data); // Call your abstractive summarization function
        }
        
    }

    // Display the result in the 'result-textarea'
    const resultTextarea = document.getElementById('result-text');
    resultTextarea.value = result;
}

