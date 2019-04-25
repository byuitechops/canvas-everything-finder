const canvas = require('canvas-api-wrapper');

var path = require('path');
var deepSearch = require('./deepSearch');
var searchTerm = 'o';



var deepItem = [
    {
        one: 1,
        oneTwo: {
            one: 'one',
            two: 'two'
        }
    },
    {
        two: 2,
        arr: [0, 1, 2, 3, 4, 5, 6, [8, 9, 10, [11]]]
    },
    {
        food: {
            taco: 'taco',
            burrito: 'burrito',
            cheese: 'cheese',
            more: {
                moar: 'moar!!!!',
            }
        }
    },
    {
        null: null,
        undef: undefined,
        emptyObj: {}, // FIXME??? Cant search for empty objects
        emptyArr: [], // FIXME??? Cant search for empty arrays
        function: () => { } // NOTE: Shows up when searching '{}'. 
    }
];

/* deepItem = {
    a: {
        one: 1,
        oneTwo: {
            one: 'one',
            two: 'two'
        }
    },
    b: {
        two: 2,
        arr: [0, 1, 2, 3, 4, 5, 6, [8, 9, 10, [11]]],
        bool: {
            trueBool: true,
            trueStr: 'true',
            falseBool: false, 
            falseStr: 'false'
        }
    },
    c: {
        food: {
            taco: 'taco',
            burrito: 'burrito',
            cheese: 'cheese',
            more: {
                moar: 'moar!!!!',
            }
        }
    },
    d: {
        null: null,
        undef: undefined,
        emptyObj: {}, // FIXME??? Cant search for empty objects
        emptyArr: [], // FIXME??? Cant search for empty arrays
        function: () => {} // NOTE: Shows up when searching '{}'. 
    }
}; */

// deepItem = 4;

// console.log('thingything', typeof deepItem);
var ds = deepSearch(deepItem, searchTerm);
console.log(ds);
// var dsPath = ds[4].path;
// console.log( path.join(...dsPath) );


function objectCrawler() { }
var searchTerm2 = "byui.brightspace.com"
var deepItem2 = [{
    "id": 1159827,
    "description": "<div class=\"byui faml445\">\r\n<div class=\"overview\">\r\n<h2>Overview</h2>\r\n<ul>\r\n<li>\n<strong>Task:</strong> Create an intake summary</li>\r\n<li>\n<strong>Purpose:</strong> Assess the needs of the individual or target audience</li>\r\n<li>\n<strong>Instructor:</strong> Your instructor will evaluate your submission</li>\r\n</ul>\r\n</div>\r\n<div class=\"instructions\">\r\n<h2>Instructions</h2>\r\n</div>\r\n</div>\r\n<ol>\r\n<li>Intake Summary (Practice Version) - An intake summary is simply a summary of an interview conducted with an individual in order to understand their background, circumstances, and specific needs so that these needs can be addressed through a given service. Therefore, you will need to complete an intake summary for each of the participants you work with through Family Relations. For those who may work in a human service setting, conducting an intake interview and writing a summary is a valuable skill and used readily.<br><br>\n</li>\r\n<li>For the purpose of this learning activity, you are to practice conducting an intake interview and summary and are to do so with your assigned partner using Google+, or whatever technology you will be using with your participants.\r\n<ol>\r\n<li>Conduct the intake interview with your partner as if your partner was a participant in Family Relations. You are encouraged to take notes during the interview so you don't forget the information.</li>\r\n<li>For role-playing purposes, you and your partner can identify some family related area that would be of interest to you if you were participating in the program.</li>\r\n<li>After conducting the interview, you are to provide a write-up (Intake Summary) as if this is an actual person you would be working with through Family Relations.</li>\r\n<li>Afterward, submit the practice intake summary to the instructor. In the future, you and your partner are to work together to conduct an interview and write an intake summary for each participant you work with through Family Relations.<br><br>\n</li>\r\n</ol>\r\n</li>\r\n<li>The types of information you collect in an intake interview will obviously depend on the purpose and service that is to be delivered. The following form (see link below) lists types of information that may be helpful to understand for this family practicum, where you will be teaching family life education. Use the format from this<span style=\"font-size: 1rem;\"> </span><a style=\"font-size: 1rem;\" href=\"https://byui.brightspace.com/content/enforced/16187-FAML445/Course%20Files/Intake%20Assessment%20Form.docx?_&amp;d2lSessionVal=rNWYoW5vmG3RuMOOUk9QEHq1R&amp;ou=16187\" target=\"_blank\">Family Relations Intake Assessment Form</a><span style=\"font-size: 1rem;\"> to help structure the interview and the write-up. The intake summary is to be written as a formal paper, using headings to structure each section. It must be well organized and very professional.<br><br></span>\n</li>\r\n<li>When conducting the interview, you and your assigned partner are to use your very best interviewing skills. Use open-ended questions to learn more about the background of the individual you will be servicing so that you can teach the individual within the context of their family situation, circumstances, strengths, and challenges. Before conducting the interview, be sure to explain to the participant the purpose of the interview, along with approximately how long the interview will take to complete (expect 30-40 minutes).<br><br>\n</li>\r\n<li>Participant Needs and Learning Goals - As you will note, toward the end of the intake form there are two sections that are especially important: <em style=\"font-size: 1rem;\"><strong>Current Family Related Needs</strong></em><span style=\"font-size: 1rem;\"> and </span><strong style=\"font-size: 1rem;\"><em>Learning Goals</em>.</strong><span style=\"font-size: 1rem;\"> These two areas are among the most important. The other sections help provide the background or context that is helpful in order to better serve an individual, however these two sections are related to asking the right questions so that you know and are able to summarize the specific needs of the individual/family, including the specific learning goals that will be the focus of the education you provide. So, for these sections, the challenge is to listen carefully and ask questions to help you take all of the information that has been provided and to boil this down to the specific needs. Once the specific needs are identified, precise learning goals can be created to address those needs. A good question to help you translate the needs into learning goals is, \"What does the individual/family need to know/do/change in order to address these needs and to help the individual/family function at a higher level?\" The answer to this question will help you to articulate specific learning goals that will be the focus of the education you provide.<br><br></span>\n</li>\r\n<li>Caution: Respecting Privacy - When conducting the intake interview, collect the information needed to better understand the individual and his/her family, especially in areas that are more specific to the needs of the family. In fact, related to the needs of the family, as mentioned above, make sure you collect enough information that you thoroughly understand what their specific needs are. Having said this, remember that you are working with real people and must be careful to not violate one's privacy by asking questions for the sake of curiosity. In short, use wisdom. Respect the privacy of those whom you work with.<br><br>\n</li>\r\n<li>Remember to submit your completed work here by the due date (see calendar). The recommended re-submission deadline is 7-10 days after initial feedback.</li>\r\n</ol>",
    "due_at": "2019-05-05T05:59:59Z",
    "unlock_at": null,
    "lock_at": null,
    "points_possible": 4.0,
    "grading_type": "letter_grade",
    "assignment_group_id": 157291,
    "grading_standard_id": null,
    "created_at": "2019-01-04T19:46:05Z",
    "updated_at": "2019-03-14T17:22:50Z",
    "peer_reviews": false,
    "automatic_peer_reviews": false,
    "position": 2,
    "grade_group_students_individually": false,
    "anonymous_peer_reviews": false,
    "group_category_id": null,
    "post_to_sis": false,
    "moderated_grading": false,
    "omit_from_final_grade": true,
    "intra_group_peer_reviews": false,
    "anonymous_instructor_annotations": false,
    "anonymous_grading": false,
    "graders_anonymous_to_graders": false,
    "grader_count": 0,
    "grader_comments_visible_to_graders": true,
    "final_grader_id": null,
    "grader_names_visible_to_final_grader": true,
    "allowed_attempts": -1,
    "secure_params": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsdGlfYXNzaWdubWVudF9pZCI6IjE0OTRhYmU5LTE5N2YtNDg0Zi1hN2Y3LWJmN2Y4NTBlZjE1ZCJ9.KZ1ICKRg1yE4Ysj2R8GI63kzPFVuBXUMH_l5wFj4ZZ0",
    "course_id": 39264,
    "name": "W02 FR Portfolio: Practice Intake Summary",
    "submission_types": [
        "online_text_entry",
        "online_url",
        "online_upload"
    ],
    "has_submitted_submissions": false,
    "due_date_required": false,
    "max_name_length": 255,
    "in_closed_grading_period": false,
    "is_quiz_assignment": false,
    "can_duplicate": true,
    "original_course_id": null,
    "original_assignment_id": null,
    "original_assignment_name": null,
    "workflow_state": "published",
    "muted": false,
    "html_url": "https://byui.instructure.com/courses/39264/assignments/1159827",
    "has_overrides": false,
    "integration_id": null,
    "integration_data": {

    },
    "published": true,
    "unpublishable": true,
    "only_visible_to_overrides": false,
    "locked_for_user": false,
    "submissions_download_url": "https://byui.instructure.com/courses/39264/assignments/1159827/submissions?zip=1",
    "anonymize_students": false
}]

// console.log(deepSearch(deepItem2, searchTerm2))

// async function searchTest3(cid) {
//     var deepItem3 = await canvas.get(`/api/v1/courses/${cid}/assignments`);
//     var r = deepSearch(deepItem3, searchTerm2);
//     console.log(r);
// }
// searchTest3(39264);

// require('./_cids.json').forEach(cid => searchTest3(cid))