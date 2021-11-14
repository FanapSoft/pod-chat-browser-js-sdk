(function () {
    /**
     * Global Variables
     */
    var KurentoUtils,
        WebrtcAdapter;

    function ChatCall(params) {
        if (typeof (require) !== 'undefined' && typeof (exports) !== 'undefined') {
            KurentoUtils = require('kurento-utils');
            WebrtcAdapter = require('webrtc-adapter');
        } else {
            KurentoUtils = window.kurentoUtils;
            WebrtcAdapter = window.adapter;
        }



        var Utility = params.Utility,
            currentModuleInstance = this,
            Sentry = params.Sentry,
            asyncClient = params.asyncClient,
            chatEvents = params.chatEvents,
            chatMessaging = params.chatMessaging,
            token = params.token,
            messagesCallbacks = {},
            asyncRequestTimeouts = {},
            chatMessageVOTypes = {
                CREATE_THREAD: 1,
                MESSAGE: 2,
                SENT: 3,
                DELIVERY: 4,
                SEEN: 5,
                PING: 6,
                BLOCK: 7,
                UNBLOCK: 8,
                LEAVE_THREAD: 9,
                ADD_PARTICIPANT: 11,
                GET_STATUS: 12,
                GET_CONTACTS: 13,
                GET_THREADS: 14,
                GET_HISTORY: 15,
                CHANGE_TYPE: 16,
                REMOVED_FROM_THREAD: 17,
                REMOVE_PARTICIPANT: 18,
                MUTE_THREAD: 19,
                UNMUTE_THREAD: 20,
                UPDATE_THREAD_INFO: 21,
                FORWARD_MESSAGE: 22,
                USER_INFO: 23,
                USER_STATUS: 24,
                GET_BLOCKED: 25,
                RELATION_INFO: 26,
                THREAD_PARTICIPANTS: 27,
                EDIT_MESSAGE: 28,
                DELETE_MESSAGE: 29,
                THREAD_INFO_UPDATED: 30,
                LAST_SEEN_UPDATED: 31,
                GET_MESSAGE_DELIVERY_PARTICIPANTS: 32,
                GET_MESSAGE_SEEN_PARTICIPANTS: 33,
                IS_NAME_AVAILABLE: 34,
                JOIN_THREAD: 39,
                BOT_MESSAGE: 40,
                SPAM_PV_THREAD: 41,
                SET_ROLE_TO_USER: 42,
                REMOVE_ROLE_FROM_USER: 43,
                CLEAR_HISTORY: 44,
                SYSTEM_MESSAGE: 46,
                GET_NOT_SEEN_DURATION: 47,
                PIN_THREAD: 48,
                UNPIN_THREAD: 49,
                PIN_MESSAGE: 50,
                UNPIN_MESSAGE: 51,
                UPDATE_CHAT_PROFILE: 52,
                CHANGE_THREAD_PRIVACY: 53,
                GET_PARTICIPANT_ROLES: 54,
                GET_REPORT_REASONS: 56,
                REPORT_THREAD: 57,
                REPORT_USER: 58,
                REPORT_MESSAGE: 59,
                GET_CONTACT_NOT_SEEN_DURATION: 60,
                ALL_UNREAD_MESSAGE_COUNT: 61,
                CREATE_BOT: 62,
                DEFINE_BOT_COMMAND: 63,
                START_BOT: 64,
                STOP_BOT: 65,
                LAST_MESSAGE_DELETED: 66,
                LAST_MESSAGE_EDITED: 67,
                BOT_COMMANDS: 68,
                THREAD_ALL_BOTS: 69,
                CALL_REQUEST: 70,
                ACCEPT_CALL: 71,
                REJECT_CALL: 72,
                RECEIVE_CALL_REQUEST: 73,
                START_CALL: 74,
                END_CALL_REQUEST: 75,
                END_CALL: 76,
                GET_CALLS: 77,
                RECONNECT: 78,
                CONNECT: 79,
                CONTACT_SYNCED: 90,
                GROUP_CALL_REQUEST: 91,
                LEAVE_CALL: 92,
                ADD_CALL_PARTICIPANT: 93,
                CALL_PARTICIPANT_JOINED: 94,
                REMOVE_CALL_PARTICIPANT: 95,
                TERMINATE_CALL: 96,
                MUTE_CALL_PARTICIPANT: 97,
                UNMUTE_CALL_PARTICIPANT: 98,
                LOGOUT: 100,
                LOCATION_PING: 101,
                CLOSE_THREAD: 102,
                REMOVE_BOT_COMMANDS: 104,
                SEARCH: 105,
                CONTINUE_SEARCH: 106,
                REGISTER_ASSISTANT: 107,
                DEACTIVATE_ASSISTANT: 108,
                GET_ASSISTANTS: 109,
                ACTIVE_CALL_PARTICIPANTS: 110,
                CALL_SESSION_CREATED: 111,
                IS_BOT_NAME_AVAILABLE: 112,
                TURN_ON_VIDEO_CALL: 113,
                TURN_OFF_VIDEO_CALL: 114,
                ASSISTANT_HISTORY: 115,
                BLOCK_ASSISTANT: 116,
                UNBLOCK_ASSISTANT: 117,
                BLOCKED_ASSISTANTS: 118,
                RECORD_CALL: 121,
                END_RECORD_CALL: 122,
                START_SCREEN_SHARE: 123,
                END_SCREEN_SHARE: 124,
                DELETE_FROM_CALL_HISTORY: 125,
                DESTINATED_RECORD_CALL: 126,
                MUTUAL_GROUPS: 130,
                CREATE_TAG: 140,
                EDIT_TAG: 141,
                DELETE_TAG: 142,
                ADD_TAG_PARTICIPANT: 143,
                REMOVE_TAG_PARTICIPANT: 144,
                GET_TAG_LIST: 145,
                DELETE_MESSAGE_THREAD: 151,
                EXPORT_CHAT: 152,
                ERROR: 999
            },
            inviteeVOidTypes = {
                TO_BE_USER_SSO_ID: 1,
                TO_BE_USER_CONTACT_ID: 2,
                TO_BE_USER_CELLPHONE_NUMBER: 3,
                TO_BE_USER_USERNAME: 4,
                TO_BE_USER_ID: 5,
                TO_BE_CORE_USER_ID: 6
            },
            callTypes = {
                'VOICE': 0x0,
                'VIDEO': 0x1
            },
            callOptions = params.callOptions,
            callTurnIp = (params.callOptions
                && params.callOptions.hasOwnProperty('callTurnIp')
                && typeof params.callOptions.callTurnIp === 'string')
                ? params.callOptions.callTurnIp
                : '46.32.6.188',
            callDivId = (params.callOptions
                && params.callOptions.hasOwnProperty('callDivId')
                && typeof params.callOptions.callDivId === 'string')
                ? params.callOptions.callDivId
                : 'call-div',
            callAudioTagClassName = (params.callOptions
                && params.callOptions.hasOwnProperty('callAudioTagClassName')
                && typeof params.callOptions.callAudioTagClassName === 'string')
                ? params.callOptions.callAudioTagClassName
                : '',
            callVideoTagClassName = (params.callOptions
                && params.callOptions.hasOwnProperty('callVideoTagClassName')
                && typeof params.callOptions.callVideoTagClassName === 'string')
                ? params.callOptions.callVideoTagClassName
                : '',
            callVideoMinWidth = (params.callOptions
                && params.callOptions.hasOwnProperty('callVideo')
                && typeof params.callOptions.callVideo === 'object'
                && params.callOptions.callVideo.hasOwnProperty('minWidth'))
                ? params.callOptions.callVideo.minWidth
                : 320,
            callVideoMinHeight = (params.callOptions
                && params.callOptions.hasOwnProperty('callVideo')
                && typeof params.callOptions.callVideo === 'object'
                && params.callOptions.callVideo.hasOwnProperty('minHeight'))
                ? params.callOptions.callVideo.minHeight
                : 180,
            currentCallParams = {},
            currentCallId = null,
            shouldReconnectCallTimeout = null,
            callTopics = {},
            screenShareState = {
                started: false,
                imOwner: false
            },
            callClientType = {
                WEB: 1,
                ANDROID: 2,
                DESKTOP: 3
            },
            webpeers = {},
            callUsers = {},
            webpeersMetadata = {},
            callRequestController = {
                callRequestReceived: false,
                callEstablishedInMySide: false,
                iCanAcceptTheCall: function () {
                    return callRequestController.callRequestReceived && callRequestController.callEstablishedInMySide;
                },
                cameraPaused: true
            },
            uiRemoteMedias = {},
            callStopQueue = {
                callStarted: false,
            },
            callServerName,
            messageTtl = params.messageTtl || 10000,
            config = {
                getHistoryCount: 50
            },
            callRequestTimeout = (typeof params.callRequestTimeout === 'number' && params.callRequestTimeout >= 0) ? params.callRequestTimeout : 10000,
            consoleLogging = (params.asyncLogging.consoleLogging && typeof params.asyncLogging.consoleLogging === 'boolean')
                ? params.asyncLogging.consoleLogging
                : false;

        var init = function () {

            },
            sendCallMessage = function (message, callback) {
                message.token = token;

                var uniqueId;

                if (typeof params.uniqueId != 'undefined') {
                    uniqueId = params.uniqueId;
                } else {
                    uniqueId = Utility.generateUUID();
                }

                message.uniqueId = uniqueId;

                var data = {
                    type: 3,
                    content: {
                        peerName: callServerName,
                        priority: 1,
                        content: JSON.stringify(message),
                        ttl: messageTtl
                    }
                };

                if (typeof callback == 'function') {
                    chatMessaging.messagesCallbacks[uniqueId] = callback;
                }

                asyncClient.send(data, function (res) {
                    if (!res.hasError && callback) {
                        if (typeof callback == 'function') {
                            callback(res);
                        }

                        if (chatMessaging.messagesCallbacks[uniqueId]) {
                            delete chatMessaging.messagesCallbacks[uniqueId];
                        }
                    }
                });

                if (callRequestTimeout > 0) {
                    asyncRequestTimeouts[uniqueId] && clearTimeout(asyncRequestTimeouts[uniqueId]);
                    asyncRequestTimeouts[uniqueId] = setTimeout(function () {
                        if (typeof callback == 'function') {
                            callback({
                                done: 'SKIP'
                            });
                        }

                        if (chatMessaging.messagesCallbacks[uniqueId]) {
                            delete chatMessaging.messagesCallbacks[uniqueId];
                        }
                    }, callRequestTimeout);
                }
            },

            /**
             * Format Data To Make Call Participant
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @param threadId
             * @return {object} participant Object
             */
            formatDataToMakeCallParticipant = function (messageContent) {
                /**
                 * + CallParticipantVO                   {object}
                 *    - id                           {int}
                 *    - joinTime                     {int}
                 *    - leaveTime                    {int}
                 *    - threadParticipant            {object}
                 *    - sendTopic                    {string}
                 *    - receiveTopic                 {string}
                 *    - brokerAddress                {string}
                 *    - active                       {boolean}
                 *    - callSession                  {object}
                 *    - callStatus                   {int}
                 *    - createTime                   {int}
                 *    - sendKey                      {string}
                 *    - mute                         {boolean}
                 */

                var participant = {
                    id: messageContent.id,
                    joinTime: messageContent.joinTime,
                    leaveTime: messageContent.leaveTime,
                    sendTopic: messageContent.sendTopic,
                    receiveTopic: messageContent.receiveTopic,
                    brokerAddress: messageContent.brokerAddress,
                    active: messageContent.active,
                    callSession: messageContent.callSession,
                    callStatus: messageContent.callStatus,
                    createTime: messageContent.createTime,
                    sendKey: messageContent.sendKey,
                    mute: messageContent.mute
                };

                // Add Chat Participant if exist
                if (messageContent.participantVO) {
                    participant.participantVO = messageContent.participantVO;
                }

                // Add Call Session if exist
                if (messageContent.callSession) {
                    participant.callSession = messageContent.callSession;
                }

                // return participant;
                return JSON.parse(JSON.stringify(participant));
            },

            /**
             * Format Data To Make Call Message
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} Call message Object
             */
            formatDataToMakeCallMessage = function (threadId, pushMessageVO) {
                /**
                 * + CallVO                   {object}
                 *    - id                    {int}
                 *    - creatorId             {int}
                 *    - type                  {int}
                 *    - createTime            {string}
                 *    - startTime             {string}
                 *    - endTime               {string}
                 *    - status                {int}
                 *    - isGroup               {boolean}
                 *    - callParticipants      {object}
                 *    - partnerParticipantVO  {object}
                 *    - conversationVO        {object}
                 */
                var callMessage = {
                    id: pushMessageVO.id,
                    creatorId: pushMessageVO.creatorId,
                    type: pushMessageVO.type,
                    createTime: pushMessageVO.createTime,
                    startTime: pushMessageVO.startTime,
                    endTime: pushMessageVO.endTime,
                    status: pushMessageVO.status,
                    isGroup: pushMessageVO.isGroup,
                    callParticipants: pushMessageVO.callParticipants,
                    partnerParticipantVO: pushMessageVO.partnerParticipantVO,
                    conversationVO: pushMessageVO.conversationVO
                };

                // return pinMessage;
                return JSON.parse(JSON.stringify(callMessage));
            },

            /**
             * Reformat Call Participants
             *
             * This functions reformats given Array of call Participants
             * into proper call participant
             *
             * @access private
             *
             * @param {object}  participantsContent   Array of Call Participant Objects
             * @param {int}    threadId              Id of call
             *
             * @return {object} Formatted Call Participant Array
             */
            reformatCallParticipants = function (participantsContent) {
                var returnData = [];

                for (var i = 0; i < participantsContent.length; i++) {
                    returnData.push(formatDataToMakeCallParticipant(participantsContent[i]));
                }

                return returnData;
            },

            callReceived = function (params, callback) {
                var receiveCallData = {
                    chatMessageVOType: chatMessageVOTypes.RECEIVE_CALL_REQUEST,
                    typeCode: params.typeCode,
                    pushMsgType: 3,
                    token: token
                };

                if (params) {
                    if (typeof +params.callId === 'number' && params.callId > 0) {
                        receiveCallData.subjectId = +params.callId;
                    } else {
                        chatEvents.fireEvent('error', {
                            code: 999,
                            message: 'Invalid call id!'
                        });
                        return;
                    }
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'No params have been sent to ReceiveCall()'
                    });
                    return;
                }

                return chatMessaging.sendMessage(receiveCallData, {
                    onResult: function (result) {
                        callback && callback(result);
                    }
                });
            },

            endCall = function (params, callback) {
                consoleLogging && console.log('[SDK][endCall] called...');

                var endCallData = {
                    chatMessageVOType: chatMessageVOTypes.END_CALL_REQUEST,
                    typeCode: params.typeCode,
                    pushMsgType: 3,
                    token: token
                };

                if (!callRequestController.callEstablishedInMySide) {
                    return;
                }

                if (params) {
                    if (typeof +params.callId === 'number' && params.callId > 0) {
                        endCallData.subjectId = +params.callId;
                    } else {
                        chatEvents.fireEvent('error', {
                            code: 999,
                            message: 'Invalid call id!'
                        });
                        return;
                    }
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'No params have been sent to End the call!'
                    });
                    return;
                }

                callStop();

                return chatMessaging.sendMessage(endCallData, {
                    onResult: function (result) {
                        callback && callback(result);
                    }
                });
            },

            /*
             * Call Functionalities
             */
            startCallWebRTCFunctions = function (params, callback) {
                if (callDivId) {
                    var callParentDiv,
                        callVideo = (typeof params.video === 'boolean') ? params.video : true,
                        callMute = (typeof params.mute === 'boolean') ? params.mute : false;
                        //sendingTopic = params.sendingTopic,
                        //receiveTopic = params.receiveTopic;

                    if(params.clientsList && params.clientsList.length) {
                        for(var i in params.clientsList) {
                            callStateController.setupCallParticipant(params.clientsList[i]);
                            //callStateController.callUsers.push(params.clientsList[i]);
                        }
                    }

                    callStateController.setupScreenSharingObject(params.screenShare);

                    /*callTopics['sendVideoTopic'] = 'Vi-' + sendingTopic;
                    callTopics['sendAudioTopic'] = 'Vo-' + sendingTopic;
                    callTopics['screenShare'] = params.screenShare;
                    //callTopics['receiveVideoTopic'] = 'Vi-' + receiveTopic;
                    //callTopics['receiveAudioTopic'] = 'Vo-' + receiveTopic;
                    callTopics['receive'] = [];
                    callTopics['receive'].push({
                        "VideoTopic": 'Vi-' + receiveTopic,
                        "AudioTopic": 'Vo-' + receiveTopic
                    });*/

                    /*webpeersMetadata[callTopics['sendVideoTopic']] = {
                        interval: null,
                        receivedSdpAnswer: false,
                        connectionQualityInterval: null,
                        poorConnectionCount: 0,
                        poorConnectionResolvedCount: 0,
                        isConnectionPoor: false
                    };
                    webpeersMetadata[callTopics['sendAudioTopic']] = {
                        interval: null,
                        receivedSdpAnswer: false,
                        connectionQualityInterval: null,
                        poorConnectionCount: 0,
                        poorConnectionResolvedCount: 0,
                        isConnectionPoor: false
                    };
                    webpeersMetadata[callTopics['screenShare']] = {
                        interval: null,
                        receivedSdpAnswer: false,
                        connectionQualityInterval: null,
                        poorConnectionCount: 0,
                        poorConnectionResolvedCount: 0,
                        isConnectionPoor: false
                    };

                    for(var i in callTopics['receive']) {
                        webpeersMetadata[callTopics['receive'][i]['VideoTopic']] = {
                            interval: null,
                            receivedSdpAnswer: false
                        };
                        webpeersMetadata[callTopics['receive'][i]['AudioTopic']] = {
                            interval: null,
                            receivedSdpAnswer: false
                        };
                    }*/

                    //callParentDiv = document.getElementById(callDivId);

                    /*// Local Video Tag
                    if (callVideo && !uiRemoteMedias[callTopics['sendVideoTopic']]) {
                        uiRemoteMedias[callTopics['sendVideoTopic']] = document.createElement('video');
                        var el = uiRemoteMedias[callTopics['sendVideoTopic']];
                        el.setAttribute('id', 'uiRemoteVideo-' + callTopics['sendVideoTopic']);
                        el.setAttribute('class', callVideoTagClassName);
                        el.setAttribute('playsinline', '');
                        el.setAttribute('muted', '');
                        el.setAttribute('width', callVideoMinWidth + 'px');
                        el.setAttribute('height', callVideoMinHeight + 'px');
                    }

                    // Local Audio Tag
                    if (!uiRemoteMedias[callTopics['sendAudioTopic']]) {
                        uiRemoteMedias[callTopics['sendAudioTopic']] = document.createElement('audio');
                        var el = uiRemoteMedias[callTopics['sendAudioTopic']];
                        el.setAttribute('id', 'uiRemoteAudio-' + callTopics['sendAudioTopic']);
                        el.setAttribute('class', callAudioTagClassName);
                        el.setAttribute('autoplay', '');
                        el.setAttribute('muted', '');
                        el.setAttribute('controls', '');
                    }

                    for(var i in callTopics['receive']){
                        // Remote Video Tag
                        if (callVideo && !uiRemoteMedias[callTopics['receive'][i]['VideoTopic']]) {
                            uiRemoteMedias[callTopics['receive'][i]['VideoTopic']] = document.createElement('video');
                            var el = uiRemoteMedias[callTopics['receive'][i]['VideoTopic']];
                            el.setAttribute('id', 'uiRemoteVideo-' + callTopics['receive'][i]['VideoTopic']);
                            el.setAttribute('class', callVideoTagClassName);
                            el.setAttribute('playsinline', '');
                            el.setAttribute('muted', '');
                            el.setAttribute('width', callVideoMinWidth + 'px');
                            el.setAttribute('height', callVideoMinHeight + 'px');
                        }

                        // Remote Audio Tag
                        if (!uiRemoteMedias[callTopics['receive'][i]['AudioTopic']]) {
                            uiRemoteMedias[callTopics['receive'][i]['AudioTopic']] = document.createElement('audio');
                            var el = uiRemoteMedias[callTopics['receive'][i]['AudioTopic']];
                            el.setAttribute('id', 'uiRemoteAudio-' + callTopics['receive'][i]['AudioTopic']);
                            el.setAttribute('class', callAudioTagClassName);
                            el.setAttribute('autoplay', '');
                            callMute && el.setAttribute('muted', '');
                            el.setAttribute('controls', '');
                        }
                    }*/

                    var uiRemoteElements = [], uiLocalElements;
                    for(var i in callUsers) {
                        if(callUsers[i].direction === 'send') {
                            uiLocalElements = callUsers[i].htmlElements;
                        } else {
                            uiRemoteElements['userId'] = callUsers[i].htmlElements;
                        }
                    }

                    callback && callback({
                        uiLocalElements: uiLocalElements,
                        uiRemoteElements: uiRemoteElements,
                    });

                    /*for(var i in callTopics['receive']) {
                        uiRemoteElements.push(uiRemoteMedias[callTopics['receive'][i]['AudioTopic']])
                        callVideo && uiRemoteElements.push(uiRemoteMedias[callTopics['receive'][i]['VideoTopic']])
                    }

                    if (callParentDiv) {
                        callVideo && callParentDiv.appendChild(uiRemoteMedias[callTopics['sendVideoTopic']]);
                        callParentDiv.appendChild(uiRemoteMedias[callTopics['sendAudioTopic']]);
                        if(callVideo) {
                            for(var i in callTopics['receive']) {
                                callParentDiv.appendChild(uiRemoteMedias[callTopics['receive'][i]['VideoTopic']])
                            }
                        }
                        for(var i in callTopics['receive']) {
                            callParentDiv.appendChild(uiRemoteMedias[callTopics['receive'][i]['AudioTopic']]);
                        }

                        callback && callback({
                            'uiLocalVideo': uiRemoteMedias[callTopics['sendVideoTopic']],
                            'uiLocalAudio': uiRemoteMedias[callTopics['sendAudioTopic']],
                            uiRemoteElements: uiRemoteElements
                            /!*                            'uiRemoteVideo': uiRemoteMedias[callTopics['receiveVideoTopic']],
                                                        'uiRemoteAudio': uiRemoteMedias[callTopics['receiveAudioTopic']]*!/
                        });
                    } else {
                        callback && callback({
                            'uiLocalVideo': uiRemoteMedias[callTopics['sendVideoTopic']],
                            'uiLocalAudio': uiRemoteMedias[callTopics['sendAudioTopic']],
                            uiRemoteElements: uiRemoteElements
                            /!*'uiRemoteVideo': uiRemoteMedias[callTopics['receiveVideoTopic']],
                            'uiRemoteAudio': uiRemoteMedias[callTopics['receiveAudioTopic']]*!/
                        });
                    }*/


                    callStateController.createSessionInChat(Object.assign(params, {
                        callVideo: callVideo,
                        callAudio: !callMute,
                    }));

                    /*sendCallMessage({
                        id: 'STOPALL'
                    }, function (result) {*/

                    /*handleCallSocketOpen({
                        brokerAddress: params.brokerAddress,
                        turnAddress: params.turnAddress,
                        callVideo: callVideo,
                        callAudio: !callMute,
                    });*/

                    /* });*/
                } else {
                    consoleLogging && console.log('No Call DIV has been declared!');
                    return;
                }
            },

            callStateController = {
                createSessionInChat: function (params) {
                    currentCallParams = params;
                    var callController = this;
                    consoleLogging && console.log("createSessionInChat:inside", params);
                    sendCallMessage({
                        id: 'CREATE_SESSION',
                        brokerAddress: params.brokerAddress,
                        turnAddress: params.turnAddress.split(',')[0]
                    }, function (res) {
                        if (res.done === 'TRUE') {
                            callStopQueue.callStarted = true;
                            callController.startCall(params);
                        } else if (res.done === 'SKIP') {
                            callStopQueue.callStarted = true;
                            callController.startCall(params);
                        } else {
                            consoleLogging && console.log('CREATE_SESSION faced a problem', res);
                            endCall({
                                callId: currentCallId
                            });
                        }
                    });
                },
                /**
                 * First we start a call
                 *
                 * @param params
                 */
                startCall: function (params) {
                    var callController = this;
                    for(var i in callUsers) {
                        if(i === 'screenShare')
                            continue;

                        if (params.callVideo) {
                            callController.startParticipantVideo(i);
                        }
                        if(params.callAudio) {
                            callController.startParticipantAudio(i);
                        }
                    }
                },
                setupCallParticipant: function (participant) {
                    var user = participant;
                    user.topicMetaData = {};
                    user.peers = {};
                    if(user.userId === chatMessaging.userInfo.id) {
                        user.direction = 'send';
                    } else {
                        user.direction = 'receive';
                    }
                    user.videoTopicName = 'Vi-' + user.topicSend;
                    user.audioTopicName = 'Vo-' + user.topicSend;
                    user.topicMetaData[user.videoTopicName] = {
                        interval: null,
                        receivedSdpAnswer: false,
                        connectionQualityInterval: null,
                        poorConnectionCount: 0,
                        poorConnectionResolvedCount: 0,
                        isConnectionPoor: false
                    };
                    user.topicMetaData[user.audioTopicName] = {
                        interval: null,
                        receivedSdpAnswer: false,
                        connectionQualityInterval: null,
                        poorConnectionCount: 0,
                        poorConnectionResolvedCount: 0,
                        isConnectionPoor: false
                    };
                    callUsers[user.userId] = user;
                    this.appendUserToCallDiv(user.userId, this.generateHTMLElements(user.userId));
                },
                setupScreenSharingObject: function (topic) {
                    var obj = {
                        video: true,
                    };
                    obj.topicMetaData = {};
                    obj.peers = {};
                    if(screenShareState.imOwner) {
                        obj.direction = 'send';
                    } else {
                        obj.direction = 'receive'
                    }
                    obj.videoTopicName = topic;
                    obj.topicMetaData[obj.videoTopicName] = {
                        interval: null,
                        receivedSdpAnswer: false,
                        connectionQualityInterval: null,
                        poorConnectionCount: 0,
                        poorConnectionResolvedCount: 0,
                        isConnectionPoor: false
                    };
                    callUsers['screenShare'] = obj;
                    this.generateHTMLElements('screenShare')
                },
                appendUserToCallDiv: function (userId) {
                    if(!callDivId) {
                        consoleLogging && console.log('No Call DIV has been declared!');
                        return;
                    }
                    var user = callUsers[userId]
                    var callParentDiv = document.getElementById(callDivId);
                    if(user.video)
                        user.htmlElements.container.appendChild(user.htmlElements[user.videoTopicName])
                    if(typeof user.mute !== "undefined" && !user.mute)
                        user.htmlElements.container.appendChild(user.htmlElements[user.audioTopicName])

                    callParentDiv.appendChild(user.htmlElements.container);
                },
                generateHTMLElements: function (userId) {
                    var user = callUsers[userId]
                    if(!user.htmlElements) {
                        user.htmlElements = {
                            container: document.createElement('div')
                        };
                        var el = user.htmlElements.container;
                        el.setAttribute('id', 'callParticipantWrapper-' + userId);
                        el.classList.add('participant');
                        el.classList.add('wrapper');
                        el.classList.add('user-' + userId);
                        el.classList.add((userId === chatMessaging.userInfo.id ? 'local' : 'remote'));
                    }

                    if (user.video && !user.htmlElements[user.videoTopicName]) {
                        user.htmlElements[user.videoTopicName] = document.createElement('video');
                        var el = user.htmlElements[user.videoTopicName];
                        el.setAttribute('id', 'uiRemoteVideo-' + user.videoTopicName);
                        el.setAttribute('class', callVideoTagClassName);
                        el.setAttribute('playsinline', '');
                        el.setAttribute('muted', '');
                        el.setAttribute('width', callVideoMinWidth + 'px');
                        el.setAttribute('height', callVideoMinHeight + 'px');
                    }

                    if (typeof user.mute !== 'undefined' && !user.mute && !user.htmlElements[user.audioTopicName]) {
                        user.htmlElements[user.audioTopicName] = document.createElement('audio');
                        var el = user.htmlElements[user.audioTopicName];
                        el.setAttribute('id', 'uiRemoteAudio-' + user.audioTopicName);
                        el.setAttribute('class', callAudioTagClassName);
                        el.setAttribute('autoplay', '');
                        el.setAttribute('muted', '');
                        el.setAttribute('controls', '');
                    }

                    return user.htmlElements;
                },
                /**
                 * When call started we can add participants
                 *
                 * @param params
                 * @param direction
                 */
                addParticipant: function (params, direction) {
                    //TODO: generate html elements
                    //TODO: add user to callUsers
                    //TODO: createTopics
                },
                /**
                 * When call started we can remove a participant from the call
                 *
                 * @param params
                 * @param direction
                 */
                removeParticipant: function (user) {
                    if(user === chatMessaging.userInfo.id) {
                        //TODO: only remove me
                        callStop();
                        return;
                    }
                },
                stopParticipantAudio: function (userId) {
                    this.removeTopic(userId, callUsers[userId].peers[userId].audioTopicName);
                },
                startParticipantAudio: function (userId) {
                    this.createTopic(userId, callUsers[userId].audioTopicName, 'audio', callUsers[userId].direction);
                },
                stopParticipantVideo: function (userId) {
                    this.removeTopic(userId, callUsers[userId].peers[userId].videoTopicName);
                },
                startParticipantVideo: function (userId) {
                    this.createTopic(userId, callUsers[userId].videoTopicName, 'video', callUsers[userId].direction);
                },
                createTopic: function (userId, topic, mediaType, direction, shareScreen) {
                    shareScreen = typeof shareScreen !== 'undefined' ? shareScreen : false;
                    this.getSdpOfferOptions(userId, topic, mediaType, direction, shareScreen).then(function (options){
                        callStateController.generateTopicPeer(userId, topic, mediaType, direction, options);
                    });
                },
                removeTopic: function (userId, topic) {
                    if(callUsers[userId].peers[topic]) {
                        callUsers[userId].peers[topic].dispose();
                        this.removeConnectionQualityInterval(userId, topic);
                        callUsers[userId].peers[topic] = null;
                    }
                },
                getSdpOfferOptions: function (userId, topic, mediaType, direction, shareScreen) {
                    return new Promise(function (resolve, reject) {
                        var mediaConstraints = {audio: (mediaType === 'audio'), video: (mediaType === 'video')};

                        if(direction === 'send') {
                            mediaConstraints.video = {
                                width: callVideoMinWidth,
                                height: callVideoMinHeight,
                                framerate: 15
                            }
                        }

                        var options = {
                            mediaConstraints: mediaConstraints,
                            iceTransportPolicy: 'relay',
                            onicecandidate: (candidate) => {
                                if (callUsers[userId].topicMetaData[topic].interval !== null) {
                                    clearInterval(callUsers[userId].topicMetaData[topic].interval);
                                }
                                callUsers[userId].topicMetaData[topic].interval = setInterval(function () {
                                    if (callUsers[userId].topicMetaData[topic].sdpAnswerReceived === true) {
                                        callUsers[userId].topicMetaData[topic].sdpAnswerReceived = false;
                                        clearInterval(callUsers[userId].topicMetaData[topic].interval);
                                        sendCallMessage({
                                            id: 'ADD_ICE_CANDIDATE',
                                            topic: topic,
                                            candidateDto: candidate
                                        })
                                    }
                                }, 500, {candidate: candidate});
                            },
                            configuration: {
                                iceServers: callStateController.getTurnServer(currentCallParams)
                            }
                        };

                        options[(direction === 'send' ? 'localVideo' : 'remoteVideo')] = callUsers[userId].htmlElements[topic];

                        if(direction === 'send' && mediaType === 'video' && shareScreen) {
                            navigator.mediaDevices.getDisplayMedia().then(function (result) {
                                options.videoStream = result;
                                options.sendSource = 'screen';
                                // options[(direction === 'send' ? 'localVideo' : 'remoteVideo')] = uiRemoteMedias[topic];
                                resolve(options);
                            }).catch(function (error) {
                                console.log(error);
                                explainUserMediaError(error, 'video', 'screen');
                                resolve(options);
                            });
                        } else {
                            resolve(options);
                        }
                        consoleLogging && console.log("[SDK][getSdpOfferOptions] ", "topic: ", topic, "mediaType: ", mediaType, "direction: ", direction, "options: ", options);
                    });
                },
                getTurnServer: function (params) {
                    if (!!params.turnAddress && params.turnAddress.length > 0) {
                        var serversTemp = params.turnAddress.split(',');

                        return [
                            {
                                "urls": "turn:" + serversTemp[0],
                                "username": "mkhorrami",
                                "credential": "mkh_123456"
                            }
                        ];
                    } else {
                        return [
                            {
                                "urls": "turn:" + callTurnIp + ":3478",
                                "username": "mkhorrami",
                                "credential": "mkh_123456"
                            }
                        ];
                    }
                },
                checkConnectionQuality: function (userId, topic) {
                    callUsers[userId].peers[topic].peerConnection.getStats(null).then(stats => {
                        //console.log(' watchRTCPeerConnection:: window.setInterval then(stats:', stats)
                        //let statsOutput = "";
                        var user = callUsers[userId],
                            userMetadata = user.topicMetaData[topic]

                        stats.forEach(report => {
                            if(report && report.type && report.type === 'remote-inbound-rtp') {
                                /*statsOutput += `<h2>Report: ${report.type}</h2>\n<strong>ID:</strong> ${report.id}<br>\n` +
                                    `<strong>Timestamp:</strong> ${report.timestamp}<br>\n`;*/

                                // Now the statistics for this report; we intentially drop the ones we
                                // sorted to the top above
                                if(!report['roundTripTime'] || report['roundTripTime'] > 1) {
                                    if(userMetadata.poorConnectionCount === 10) {
                                        chatEvents.fireEvent('callEvents', {
                                            type: 'POOR_VIDEO_CONNECTION',
                                            subType: 'LONG_TIME',
                                            message: 'Poor connection for a long time',
                                            metadata: {
                                                elementId: "uiRemoteVideo-" + topic,
                                                topic: topic
                                            }
                                        });
                                    }
                                    if(userMetadata.poorConnectionCount > 3 && !userMetadata.isConnectionPoor) {
                                        //alert('Poor connection detected...');
                                        consoleLogging && console.log('[SDK][checkConnectionQuality] Poor connection detected...');
                                        chatEvents.fireEvent('callEvents', {
                                            type: 'POOR_VIDEO_CONNECTION',
                                            subType: 'SHORT_TIME',
                                            message: 'Poor connection detected',
                                            metadata: {
                                                elementId: "uiRemoteVideo-" + topic,
                                                topic: topic,
                                                userId: userId
                                            }
                                        });
                                        userMetadata.isConnectionPoor = true;
                                        userMetadata.poorConnectionCount = 0;
                                        userMetadata.poorConnectionResolvedCount = 0;
                                    } else {
                                        callUsers[userId].topicMetaData[topic].poorConnectionCount++;
                                    }
                                } else if(report['roundTripTime'] || report['roundTripTime'] < 1) {
                                    if(userMetadata.poorConnectionResolvedCount > 3 && userMetadata.isConnectionPoor) {
                                        userMetadata.poorConnectionResolvedCount = 0;
                                        userMetadata.poorConnectionCount = 0;
                                        userMetadata.isConnectionPoor = false;
                                        chatEvents.fireEvent('callEvents', {
                                            type: 'POOR_VIDEO_CONNECTION_RESOLVED',
                                            message: 'Poor connection resolved',
                                            metadata: {
                                                elementId: "uiRemoteVideo-" + topic,
                                                topic: topic
                                            }
                                        });
                                    } else {
                                        userMetadata.poorConnectionResolvedCount++;
                                    }
                                }

                                /*Object.keys(report).forEach(function (statName) {
                                    if (statName !== "id" && statName !== "timestamp" && statName !== "type") {
                                        statsOutput += `<strong>${statName}:</strong> ${report[statName]}<br>\n`;
                                    }
                                });*/
                            }
                        });

                        //document.querySelector(".stats-box").innerHTML = statsOutput;
                    });
                },

                generateTopicPeer: function (userId, topic, mediaType, direction, options) {
                    var WebRtcFunction = direction === 'send' ? 'WebRtcPeerSendonly' : 'WebRtcPeerRecvonly',
                        callController = this,
                        user = callUsers[userId],
                        topicElement = user.htmlElements[topic],
                        topicMetaData = user.topicMetaData[topic];

                    callUsers[userId].peers[topic] = new KurentoUtils.WebRtcPeer[WebRtcFunction](options, function (err) {
                        if (err) {
                            console.error("[SDK][start/webRtc " + direction + "  " + mediaType + " Peer] Error: " + explainUserMediaError(err, mediaType));
                            return;
                        }

                        callController.watchRTCPeerConnection(userId, topic, mediaType, direction);

                        if(direction === 'send') {
                            startMedia(topicElement);
                            if(callRequestController.cameraPaused) {
                                currentModuleInstance.pauseCamera();
                            }
                        }

                        callUsers[userId].peers[topic].generateOffer((err, sdpOffer) => {
                            if (err) {
                                console.error("[SDK][start/WebRc " + direction + "  " + mediaType + " Peer/generateOffer] " + err);
                                return;
                            }

                            sendCallMessage({
                                id: (direction === 'send' ? 'SEND_SDP_OFFER' : 'RECIVE_SDP_OFFER'),
                                sdpOffer: sdpOffer,
                                useComedia: true,
                                useSrtp: false,
                                topic: topic,
                                mediaType: (mediaType === 'video' ? 2 : 1)
                            });
                        });
                    });
                },
                watchRTCPeerConnection: function (userId, topic, mediaType, direction) {
                    consoleLogging && console.log("[SDK][watchRTCPeerConnection] called with: ", userId, topic, mediaType, direction);
                    var callController = this,
                        user = callUsers[userId];

                    consoleLogging && console.log("[SDK][watchRTCPeerConnection] called with: ", callUsers, user);

                    user.peers[topic].peerConnection.onconnectionstatechange = function () {
                        consoleLogging && console.log("[SDK][peerConnection.onconnectionstatechange] ", "peer: ", topic, " peerConnection.connectionState: ", user.peers[topic].peerConnection.connectionState);
                        if (user.peers[topic].peerConnection.connectionState === 'disconnected') {
                            callController.removeConnectionQualityInterval(userId, topic);
                        }

                        if (user.peers[topic].peerConnection.connectionState === "failed") {
                            chatEvents.fireEvent('callEvents', {
                                type: 'CALL_STATUS',
                                errorCode: 7000,
                                errorMessage: `Call Peer (${topic}) has failed!`,
                                errorInfo: user.peers[topic]
                            });
                            setTimeout(function () {
                                if(chatMessaging.chatState) {
                                    callController.shouldReconnectTopic(userId, topic, mediaType, direction);
                                }
                            }, 7000);

                            callController.removeConnectionQualityInterval(userId, topic);
                        }

                        if(user.peers[topic].peerConnection.connectionState === 'connected') {
                            if(mediaType === 'video' && direction === 'send') {
                                user.topicMetaData[topic].connectionQualityInterval = setInterval(function() {
                                    callController.checkConnectionQuality(userId, topic, mediaType, direction)
                                }, 1000);
                            }
                        }
                    }

                    user.peers[topic].peerConnection.oniceconnectionstatechange = function () {
                        consoleLogging && console.log("[SDK][oniceconnectionstatechange] ", "peer: ", topic, " peerConnection.connectionState: ", user.peers[topic].peerConnection.iceConnectionState);
                        if (user.peers[topic].peerConnection.iceConnectionState === 'disconnected') {
                            chatEvents.fireEvent('callEvents', {
                                type: 'CALL_STATUS',
                                errorCode: 7000,
                                errorMessage: `Call Peer (${topic}) is disconnected!`,
                                errorInfo: user.peers[topic]
                            });

                            consoleLogging && console.log('[SDK][oniceconnectionstatechange]:[disconnected] Internet connection failed, Reconnect your call, topic:', topic);
                        }

                        if (user.peers[topic].peerConnection.iceConnectionState === "failed") {
                            chatEvents.fireEvent('callEvents', {
                                type: 'CALL_STATUS',
                                errorCode: 7000,
                                errorMessage: `Call Peer (${topic}) has failed!`,
                                errorInfo: user.peers[topic]
                            });
                            if(chatMessaging.chatState) {
                                callController.shouldReconnectTopic(userId, topic, mediaType, direction);
                            } else {
                                setTimeout(function () {
                                    if(chatMessaging.chatState) {
                                        callController.shouldReconnectTopic(userId, topic, mediaType, direction);
                                    }
                                }, 7000);
                            }
                        }

                        if (user.peers[topic].peerConnection.iceConnectionState === "connected") {
                            callRequestController.callEstablishedInMySide = true;
                            chatEvents.fireEvent('callEvents', {
                                type: 'CALL_STATUS',
                                errorCode: 7000,
                                errorMessage: `Call Peer (${topic}) has connected!`,
                                errorInfo: user.peers[topic]
                            });
                        }
                    }
                },
                shouldReconnectTopic: function (userId, topic, mediaType, direction) {
                    var callController = this, iceConnectionState = callUsers[userId].peers[topic].peerConnection.iceConnectionState;
                    if (currentCallParams && Object.keys(currentCallParams).length) {
                        if (callUsers[userId]
                            && callUsers[userId].peers[topic]
                            && iceConnectionState != 'connected') {
                            chatEvents.fireEvent('callEvents', {
                                type: 'CALL_STATUS',
                                errorCode: 7000,
                                errorMessage: `Call Peer (${topic}) is not in connected state, Restarting call in progress ...!`,
                                errorInfo: callUsers[userId].peers[topic]
                            });

                            sendCallMessage({
                                id: 'STOP',
                                topic: topic
                            }, function (result) {
                                if (result.done === 'TRUE') {
                                    callController.removeTopic(userId, topic);
                                    callController.createTopic(userId, topic, mediaType, direction, userId === 'screenShare');
                                } else if (result.done === 'SKIP') {
                                    callController.removeTopic(userId, topic);
                                    callController.createTopic(userId, topic, mediaType, direction, userId === 'screenShare');
                                    //generateAndSendSdpOffers(currentCallParams, [topicName]);
                                } else {
                                    consoleLogging && console.log('STOP topic faced a problem', result);
                                    endCall({
                                        callId: currentCallId
                                    });
                                    callStop();
                                }
                            });
                        }
                    }
                },
                maybeReconnectAllTopics: function (){
                    if(!callUsers || !Object.keys(callUsers).length || !callRequestController.callEstablishedInMySide)
                        return;

                    for(var i in callUsers) {
                        var videoTopic = callUsers[i].videoTopicName, audioTopic = callUsers[i].audioTopicName;
                        if(callUsers[i] && callUsers[i].peers[videoTopic] && callUsers[i].peers[videoTopic].peerConnection.connectionState !== 'connected'){
                            this.shouldReconnectTopic(i, videoTopic, 'video', callUsers[i].direction)
                        }
                        if(callUsers[i] && callUsers[i].peers[audioTopic] && callUsers[i].peers[videoTopic].peerConnection.connectionState !== 'connected'){
                            this.shouldReconnectTopic(i, audioTopic, 'audio', callUsers[i].direction)
                        }
                    }
                },
                removeConnectionQualityInterval: function (userId, topic) {
                    callUsers[userId].topicMetaData[topic]['poorConnectionCount'] = 0;
                    clearInterval(callUsers[userId].topicMetaData[topic]['connectionQualityInterval']);
                },
                removeStreamFromWebRTC : function (userId, topic) {
                    if(callUsers[userId].htmlElements[topic]){
                        const stream = callUsers[userId].htmlElements[topic].srcObject;
                        if (!!stream) {
                            const tracks = stream.getTracks();

                            if (!!tracks) {
                                tracks.forEach(function (track) {
                                    track.stop();
                                });
                            }

                            callUsers[userId].htmlElements[topic].srcObject = null;
                        }

                        callUsers[userId].htmlElements[topic].remove();
                        delete (callUsers[userId].htmlElements[topic]);
                    }
                },
                addScreenShareToCall: function (direction, shareScreen) {
                    if(direction !== callUsers["screenShare"].direction) {
                        callUsers['screenShare'].direction = direction
                    }
                    var callController = this,
                        screenShare = callUsers["screenShare"];
                    if(!screenShare.peers[screenShare.videoTopicName]) {
                        // Local Video Tag
                        if(!screenShare.htmlElements[screenShare.videoTopicName]) {
                            callStateController.generateHTMLElements('screenShare');
                        }
                        setTimeout(function () {
                            callStateController.appendUserToCallDiv('screenShare');
                            callStateController.createTopic('screenShare', screenShare.videoTopicName, "video", direction, shareScreen);
                        });
                    } else {
                        callStateController.removeTopic('screenShare', screenShare.videoTopicName);
                        callStateController.createTopic('screenShare', screenShare.videoTopicName, "video", direction, shareScreen);
                        startMedia(screenShare.htmlElements[screenShare.videoTopicName])
                    }
                },
                removeScreenShareFromCall: function (topic) {
                    var callController = this,
                        screenShare = callUsers["screenShare"];
                    if(screenShare.peers[screenShare.videoTopicName]) {
                        // Local Video Tag

                        //removeStreamFromWebRTC(callTopics['screenShare']);
                        callStateController.removeStreamFromWebRTC('screenShare', screenShare.videoTopicName)
                        callStateController.removeTopic('screenShare', screenShare.videoTopicName);
                    }
                },
                removeAllCallParticipants: function () {
                    for (var i in callUsers) {
                        var user = callUsers[i];
                        if (user) {
                            if(user.peers[user.videoTopicName]) {
                                callUsers[i].peers[user.videoTopicName].dispose();
                                delete callUsers[i].peers[user.videoTopicName];
                                callStateController.removeStreamFromWebRTC(i, user.videoTopicName);
                                callStateController.removeConnectionQualityInterval(i, user.videoTopicName);
                            }
                            if(user.peers[user.audioTopicName]) {
                                callUsers[i].peers[user.audioTopicName].dispose();
                                delete callUsers[i].peers[user.audioTopicName];
                                callStateController.removeStreamFromWebRTC(i, user.audioTopicName);
                                callStateController.removeConnectionQualityInterval(i, user.audioTopicName);
                            }
                            callUsers[i].peers = {};
                            callUsers[i] = null;
                        }
                    }
                },
                removeFromCallUI: function (topic) {
                    var videoElement = 'Vi-' + topic,
                        audioElement = 'Vo-' + topic,
                        userId = this.findUserIdByTopic(videoElement);

                    if (topic.length > 0 && callUsers[userId].htmlElements[videoElement]) {
                        this.removeStreamFromWebRTC(userId,videoElement);
                    }

                    if (topic.length > 0 && callUsers[userId].htmlElements[videoElement]) {
                        this.removeStreamFromWebRTC(userId, audioElement);
                    }
                },
                findUserIdByTopic: function (topic) {
                    for(var i in callUsers) {
                        if (callUsers[i].videoTopicName === topic || callUsers[i].audioTopicName === topic) {
                            //peer = callUsers[i].peers[jsonMessage.topic];
                            return i;
                        }
                    }
                },
            },

            sendCallSocketError = function (message) {
                chatEvents.fireEvent('callEvents', {
                    type: 'CALL_ERROR',
                    code: 7000,
                    message: message
                });

                sendCallMessage({
                    id: 'ERROR',
                    message: message,
                });
            },

            explainUserMediaError = function (err, deviceType, deviceSource) {
                chatEvents.fireEvent('callEvents', {
                    type: 'CALL_ERROR',
                    code: 7000,
                    message: err
                });

                const n = err.name;
                if (n === 'NotFoundError' || n === 'DevicesNotFoundError') {
                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ERROR',
                        code: 7000,
                        message: "Missing " + (deviceType === 'video' ? 'webcam' : 'mice') + " for required tracks"
                    });
                    alert("Missing " + (deviceType === 'video' ? 'webcam' : 'mice') + " for required tracks");
                    return "Missing " + (deviceType === 'video' ? 'webcam' : 'mice') + " for required tracks";
                } else if (n === 'NotReadableError' || n === 'TrackStartError') {
                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ERROR',
                        code: 7000,
                        message: (deviceType === 'video' ? 'Webcam' : 'Mice') + " is already in use"
                    });

                    alert((deviceType === 'video' ? 'Webcam' : 'Mice') + " is already in use");
                    return (deviceType === 'video' ? 'Webcam' : 'Mice') + " is already in use";
                } else if (n === 'OverconstrainedError' || n === 'ConstraintNotSatisfiedError') {
                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ERROR',
                        code: 7000,
                        message: (deviceType === 'video' ? 'Webcam' : 'Mice') + " doesn't provide required tracks"
                    });
                    alert((deviceType === 'video' ? 'Webcam' : 'Mice') + " doesn't provide required tracks");
                    return (deviceType === 'video' ? 'Webcam' : 'Mice') + " doesn't provide required tracks";
                } else if (n === 'NotAllowedError' || n === 'PermissionDeniedError') {
                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ERROR',
                        code: 7000,
                        message: (deviceType === 'video' ? (deviceSource === 'screen'? 'ScreenShare' : 'Webcam') : 'Mice') + " permission has been denied by the user"
                    });
                    alert((deviceType === 'video' ? (deviceSource === 'screen'? 'ScreenShare' : 'Webcam') : 'Mice') + " permission has been denied by the user");
                    return (deviceType === 'video' ? (deviceSource === 'screen'? 'ScreenShare' : 'Webcam') : 'Mice') + " permission has been denied by the user";
                } else if (n === 'TypeError') {
                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ERROR',
                        code: 7000,
                        message: "No media tracks have been requested"
                    });
                    return "No media tracks have been requested";
                } else {
                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ERROR',
                        code: 7000,
                        message: "Unknown error: " + err
                    });
                    return "Unknown error: " + err;
                }
            },

            setCallServerName = function (serverName) {
                if (!!serverName) {
                    callServerName = serverName;
                }
            },

            startMedia = function (media) {
                consoleLogging && console.log("[SDK][startMedia] called with: ", media);
                media.play().catch((err) => {
                    if (err.name === 'NotAllowedError') {
                        chatEvents.fireEvent('callEvents', {
                            type: 'CALL_ERROR',
                            code: 7000,
                            message: "[startMedia] Browser doesn't allow playing media: " + err
                        });
                    } else {
                        chatEvents.fireEvent('callEvents', {
                            type: 'CALL_ERROR',
                            code: 7000,
                            message: "[startMedia] Error in media.play(): " + err
                        });
                    }
                });
            },

            restartMedia = function (videoTopicParam) {
                if (currentCallParams && Object.keys(currentCallParams).length) {
                    consoleLogging && console.log('[SDK] Sending Key Frame ...');

                    var videoTopic = !!videoTopicParam ? videoTopicParam : callUsers[chatMessaging.userInfo.id].videoTopicName;//callTopics['sendVideoTopic'];
                    let videoElement = document.getElementById(`uiRemoteVideo-${videoTopic}`);

                    if (videoElement) {
                        let videoTrack = videoElement.srcObject.getTracks()[0];

                        if (navigator && !!navigator.userAgent.match(/firefox/gi)) {
                            videoTrack.enable = false;
                            let newWidth = callVideoMinWidth - (Math.ceil(Math.random() * 50) + 20);
                            let newHeight = callVideoMinHeight - (Math.ceil(Math.random() * 50) + 20);

                            videoTrack.applyConstraints({
                                width: {
                                    min: newWidth,
                                    ideal: 1280
                                },
                                height: {
                                    min: newHeight,
                                    ideal: 720
                                },
                                advanced: [
                                    {
                                        width: newWidth,
                                        height: newHeight
                                    },
                                    {
                                        aspectRatio: 1.333
                                    }
                                ]
                            }).then((res) => {
                                videoTrack.enabled = true;
                                setTimeout(() => {
                                    videoTrack.applyConstraints({
                                        "width": callVideoMinWidth,
                                        "height": callVideoMinHeight
                                    });
                                }, 500);
                            }).catch(e => consoleLogging && console.log(e));
                        } else {
                            videoTrack.applyConstraints({
                                "width": callVideoMinWidth - (Math.ceil(Math.random() * 5) + 5)
                            }).then((res) => {
                                setTimeout(function () {
                                    videoTrack.applyConstraints({
                                        "width": callVideoMinWidth
                                    });
                                }, 500);
                            }).catch(e => consoleLogging && console.log(e));
                        }
                    }
                }
            },

            handleProcessSdpAnswer = function (jsonMessage) {
                var userId = callStateController.findUserIdByTopic(jsonMessage.topic),
                 peer = callUsers[userId].peers[jsonMessage.topic];

                if (peer == null) {
                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ERROR',
                        code: 7000,
                        message: "[handleProcessSdpAnswer] Skip, no WebRTC Peer",
                        error: peer
                    });
                    return;
                }

                peer.processAnswer(jsonMessage.sdpAnswer, (err) => {
                    if (err) {
                        sendCallSocketError("[handleProcessSdpAnswer] Error: " + err);

                        chatEvents.fireEvent('callEvents', {
                            type: 'CALL_ERROR',
                            code: 7000,
                            message: "[handleProcessSdpAnswer] Error: " + err
                        });

                        return;
                    }

                    if (callUsers[userId].topicMetaData[jsonMessage.topic].interval !== null) {
                        callUsers[userId].topicMetaData[jsonMessage.topic].sdpAnswerReceived = true;
                    }
                    consoleLogging && console.log("[SDK][handleProcessSdpAnswer]", jsonMessage, jsonMessage.topic)
                    startMedia(callUsers[userId].htmlElements[jsonMessage.topic]);
                });
            },

            handleAddIceCandidate = function (jsonMessage) {
                var userId = callStateController.findUserIdByTopic(jsonMessage.topic);

                let peer = callUsers[userId].peers[jsonMessage.topic];
                if (peer == null) {
                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ERROR',
                        code: 7000,
                        message: "[handleAddIceCandidate] Skip, no WebRTC Peer",
                        error: JSON.stringify(peer)
                    });
                    return;
                }

                peer.addIceCandidate(jsonMessage.candidate, (err) => {
                    if (err) {
                        console.error("[handleAddIceCandidate] " + err);

                        chatEvents.fireEvent('callEvents', {
                            type: 'CALL_ERROR',
                            code: 7000,
                            message: "[handleAddIceCandidate] " + err,
                            error: JSON.stringify(jsonMessage.candidate)
                        });

                        return;
                    }
                });
            },

            handlePartnerFreeze = function (jsonMessage) {
                if (!!jsonMessage && !!jsonMessage.topic && jsonMessage.topic.substring(0, 2) === 'Vi') {
                    restartMedia(jsonMessage.topic);
                    setTimeout(function () {
                        restartMedia(jsonMessage.topic)
                    }, 4000);
                    setTimeout(function () {
                        restartMedia(jsonMessage.topic)
                    }, 8000);
                }
            },

            handleError = function (jsonMessage, sendingTopic, receiveTopic) {
                const errMessage = jsonMessage.message;

                chatEvents.fireEvent('callEvents', {
                    type: 'CALL_ERROR',
                    code: 7000,
                    message: "Kurento error: " + errMessage
                });
            },

            callStop = function () {
                callStateController.removeAllCallParticipants();

                if (callStopQueue.callStarted) {
                    sendCallMessage({
                        id: 'CLOSE'
                    });
                    callStopQueue.callStarted = false;
                }

                callRequestController.cameraPaused = false;
                callRequestController.callEstablishedInMySide = false;
                callRequestController.callRequestReceived = false;
                currentCallParams = {};
                currentCallId = null;
            },

            removeStreamFromWebRTC = function (RTCStream) {
                var callParentDiv = document.getElementById(callDivId);

                if (uiRemoteMedias.hasOwnProperty(RTCStream)) {
                    const stream = uiRemoteMedias[RTCStream].srcObject;
                    if (!!stream) {
                        const tracks = stream.getTracks();

                        if (!!tracks) {
                            tracks.forEach(function (track) {
                                track.stop();
                            });
                        }

                        uiRemoteMedias[RTCStream].srcObject = null;
                    }

                    uiRemoteMedias[RTCStream].remove();
                    delete (uiRemoteMedias[RTCStream]);
                }
            },

            removeFromCallUI = function (topic) {
                var videoElement = 'Vi-' + topic;
                var audioElement = 'Vo-' + topic;

                if (topic.length > 0 && uiRemoteMedias.hasOwnProperty(videoElement)) {
                    removeStreamFromWebRTC(videoElement);
                }

                if (topic.length > 0 && uiRemoteMedias.hasOwnProperty(audioElement)) {
                    removeStreamFromWebRTC(audioElement);
                }
            };

        this.updateToken = function (newToken) {
            token = newToken;
        }

        this.callMessageHandler = function (callMessage) {
            var jsonMessage = (typeof callMessage.content === 'string' && Utility.isValidJson(callMessage.content))
                ? JSON.parse(callMessage.content)
                : callMessage.content,
                uniqueId = jsonMessage.uniqueId;


            asyncRequestTimeouts[uniqueId] && clearTimeout(asyncRequestTimeouts[uniqueId]);

            switch (jsonMessage.id) {
                case 'PROCESS_SDP_ANSWER':
                    handleProcessSdpAnswer(jsonMessage);
                    break;

                case 'ADD_ICE_CANDIDATE':
                    handleAddIceCandidate(jsonMessage);
                    break;

                case 'GET_KEY_FRAME':
                    setTimeout(function () {
                        restartMedia(callUsers[chatMessaging.userInfo.id].videoTopicName);
                    }, 2000);
                    setTimeout(function () {
                        restartMedia(callUsers[chatMessaging.userInfo.id].videoTopicName);
                    }, 4000);
                    setTimeout(function () {
                        restartMedia(callUsers[chatMessaging.userInfo.id].videoTopicName);
                    }, 8000);
                    setTimeout(function () {
                        restartMedia(callUsers[chatMessaging.userInfo.id].videoTopicName);
                    }, 12000);
                    break;

                case 'FREEZED':
                    handlePartnerFreeze(jsonMessage);
                    break;

                /*case 'STOPALL':
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](jsonMessage);
                    }
                    break;*/
                case 'STOP':
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](jsonMessage);
                    }
                    break;
                case 'CLOSE':
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](jsonMessage);
                    }
                    break;

                case 'SESSION_NEW_CREATED':
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](jsonMessage);
                    }
                    break;

                case 'SESSION_REFRESH':
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](jsonMessage);
                    }
                    break;

                case 'ERROR':
                    handleError(jsonMessage, params.sendingTopic, params.receiveTopic);
                    break;

                default:
                    console.warn("[SDK][onmessage] Invalid message, id: " + jsonMessage.id, jsonMessage);
                    if (jsonMessage.match(/NOT CREATE SESSION/g)) {
                        if (currentCallParams && Object.keys(currentCallParams)) {
                            //handleCallSocketOpen(currentCallParams);
                            callStateController.createSessionInChat(currentCallParams);
                        }
                    }
                    break;
            }
        };

        this.asyncInitialized = function (async) {
            asyncClient = async;

            asyncClient.on('asyncReady', function (){
                callStateController.maybeReconnectAllTopics();
            })
        };

        this.handleChatMessages = function(type, chatMessageVOTypes, messageContent, contentCount, threadId, uniqueId) {
            switch (type) {
                /**
                 * Type 70    Send Call Request
                 */
                case chatMessageVOTypes.CALL_REQUEST:
                    callRequestController.callRequestReceived = true;
                    callReceived({
                        callId: messageContent.callId
                    }, function (r) {

                    });

                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'RECEIVE_CALL',
                        result: messageContent
                    });

                    currentCallId = messageContent.callId;

                    break;

                /**
                 * Type 71    Accept Call Request
                 */
                case chatMessageVOTypes.ACCEPT_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'ACCEPT_CALL',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 72    Reject Call Request
                 */
                case chatMessageVOTypes.REJECT_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'REJECT_CALL',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 73    Receive Call Request
                 */
                case chatMessageVOTypes.RECEIVE_CALL_REQUEST:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    if (messageContent.callId > 0) {
                        chatEvents.fireEvent('callEvents', {
                            type: 'RECEIVE_CALL',
                            result: messageContent
                        });
                    } else {
                        chatEvents.fireEvent('callEvents', {
                            type: 'PARTNER_RECEIVED_YOUR_CALL',
                            result: messageContent
                        });
                    }

                    currentCallId = messageContent.callId;

                    break;

                /**
                 * Type 74    Start Call Request
                 */
                case chatMessageVOTypes.START_CALL:
                    if(!callRequestController.iCanAcceptTheCall()) {
                        chatEvents.fireEvent('callEvents', {
                            type: 'CALL_STARTED_ELSEWHERE',
                            message: 'Call already started somewhere else..., aborting...'
                        });
                        return;
                    }

                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_STARTED',
                        result: messageContent
                    });

                    //callStateController.removeAllCallParticipants();

                    if (typeof messageContent === 'object'
                        && messageContent.hasOwnProperty('chatDataDto')
                        && !!messageContent.chatDataDto.kurentoAddress) {

                        setCallServerName(messageContent.chatDataDto.kurentoAddress.split(',')[0]);

                        startCallWebRTCFunctions({
                            video: messageContent.clientDTO.video,
                            mute: messageContent.clientDTO.mute,
                            sendingTopic: messageContent.clientDTO.topicSend,
                            receiveTopic: messageContent.clientDTO.topicReceive,
                            screenShare: messageContent.chatDataDto.screenShare,
                            brokerAddress: messageContent.chatDataDto.brokerAddressWeb,
                            turnAddress: messageContent.chatDataDto.turnAddress,
                            clientsList: messageContent.otherClientDtoList
                        }, function (callDivs) {
                            chatEvents.fireEvent('callEvents', {
                                type: 'CALL_DIVS',
                                result: callDivs
                            });
                        });
                    } else {
                        chatEvents.fireEvent('callEvents', {
                            type: 'CALL_ERROR',
                            message: 'Chat Data DTO is not present!'
                        });
                    }

                    break;

                /**
                 * Type 75    End Call Request
                 */
                case chatMessageVOTypes.END_CALL_REQUEST:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'END_CALL',
                        result: messageContent
                    });

                    callStop();

                    break;

                /**
                 * Type 76   Call Ended
                 */
                case chatMessageVOTypes.END_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_ENDED',
                        result: messageContent
                    });

                    callStop();

                    break;

                /**
                 * Type 77    Get Calls History
                 */
                case chatMessageVOTypes.GET_CALLS:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    break;

                /**
                 * Type 78    Call Partner Reconnecting
                 */
                case chatMessageVOTypes.RECONNECT:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_PARTICIPANT_RECONNECTING',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 79    Call Partner Connects
                 */
                case chatMessageVOTypes.CONNECT:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_PARTICIPANT_CONNECTED',
                        result: messageContent
                    });

                    restartMedia(callTopics['sendVideoTopic']);

                    break;

                /**
                 * Type 90    Contacts Synced
                 */
                case chatMessageVOTypes.CONTACT_SYNCED:
                    chatEvents.fireEvent('contactEvents', {
                        type: 'CONTACTS_SYNCED',
                        result: messageContent
                    });
                    break;

                /**
                 * Type 91    Send Group Call Request
                 */
                case chatMessageVOTypes.GROUP_CALL_REQUEST:
                    callReceived({
                        callId: messageContent.callId
                    }, function (r) {
                    });

                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'RECEIVE_CALL',
                        result: messageContent
                    });

                    currentCallId = messageContent.callId;

                    break;

                /**
                 * Type 92    Call Partner Leave
                 */
                case chatMessageVOTypes.LEAVE_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_PARTICIPANT_LEFT',
                        result: messageContent
                    });

                    if (!!messageContent[0].sendTopic) {
                        //removeFromCallUI(messageContent[0].sendTopic);
                        callStateController.removeFromCallUI(messageContent[0].sendTopic)
                    }

                    break;

                /**
                 * Type 93    Add Call Participant
                 */
                case chatMessageVOTypes.ADD_CALL_PARTICIPANT:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    break;

                /**
                 * Type 94    Call Participant Joined
                 */
                case chatMessageVOTypes.CALL_PARTICIPANT_JOINED:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_PARTICIPANT_JOINED',
                        result: messageContent
                    });

                    restartMedia(callTopics['sendVideoTopic']);

                    break;

                /**
                 * Type 95    Remove Call Participant
                 */
                case chatMessageVOTypes.REMOVE_CALL_PARTICIPANT:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_PARTICIPANT_REMOVED',
                        result: messageContent
                    });


                    break;

                /**
                 * Type 96    Terminate Call
                 */
                case chatMessageVOTypes.TERMINATE_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'TERMINATE_CALL',
                        result: messageContent
                    });

                    callStop();

                    break;

                /**
                 * Type 97    Mute Call Participant
                 */
                case chatMessageVOTypes.MUTE_CALL_PARTICIPANT:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_PARTICIPANT_MUTE',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 98    UnMute Call Participant
                 */
                case chatMessageVOTypes.UNMUTE_CALL_PARTICIPANT:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_PARTICIPANT_UNMUTE',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 110    Active Call Participants List
                 */
                case chatMessageVOTypes.ACTIVE_CALL_PARTICIPANTS:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }
                    break;

                /**
                 * Type 111    Kafka Call Session Created
                 */
                case chatMessageVOTypes.CALL_SESSION_CREATED:
                    if(!callRequestController.callEstablishedInMySide)
                        return;

                    chatEvents.fireEvent('callEvents', {
                        type: 'CALL_SESSION_CREATED',
                        result: messageContent
                    });

                    currentCallId = messageContent.callId;

                    break;

                /**
                 * Type 113    Turn On Video Call
                 */
                case chatMessageVOTypes.TURN_ON_VIDEO_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'TURN_ON_VIDEO_CALL',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 114    Turn Off Video Call
                 */
                case chatMessageVOTypes.TURN_OFF_VIDEO_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'TURN_OFF_VIDEO_CALL',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 121    Record Call Request
                 */
                case chatMessageVOTypes.RECORD_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'START_RECORDING_CALL',
                        result: messageContent
                    });

                    restartMedia(callTopics['sendVideoTopic']);

                    break;

                /**
                 * Type 122   End Record Call Request
                 */
                case chatMessageVOTypes.END_RECORD_CALL:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'STOP_RECORDING_CALL',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 123   Start Screen Share
                 */
                case chatMessageVOTypes.START_SCREEN_SHARE:
                    if(!callRequestController.callEstablishedInMySide)
                        return;

                    screenShareState.started = true;
                    if(messageContent.screenOwner.id === chatMessaging.userInfo.id) {
                        screenShareState.imOwner = true;
                    } else {
                        screenShareState.imOwner = false;
                    }

                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    } else if(!screenShareState.imOwner) {
                        callStateController.addScreenShareToCall("receive", false)
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'START_SCREEN_SHARE',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 124   End Screen Share
                 */
                case chatMessageVOTypes.END_SCREEN_SHARE:
                    screenShareState.imOwner = false;
                    screenShareState.started = false;

                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    } else if (!screenShareState.imOwner) {
                       consoleLogging && console.log("[SDK][END_SCREEN_SHARE], im not owner of screen");
                       callStateController.removeScreenShareFromCall();
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'END_SCREEN_SHARE',
                        result: messageContent
                    });

                    break;

                /**
                 * Type 125   Delete From Call List
                 */
                case chatMessageVOTypes.DELETE_FROM_CALL_HISTORY:
                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'DELETE_FROM_CALL_LIST',
                        result: messageContent
                    });

                    break;
                /**
                 * Type 126   Destinated Record Call Request
                 */
                case chatMessageVOTypes.DESTINATED_RECORD_CALL:
                    if(!callRequestController.callEstablishedInMySide)
                        return;

                    if (chatMessaging.messagesCallbacks[uniqueId]) {
                        chatMessaging.messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                    }

                    chatEvents.fireEvent('callEvents', {
                        type: 'START_RECORDING_CALL',
                        result: messageContent
                    });

                    restartMedia(callTopics['sendVideoTopic']);

                    break;
            }
        }

        this.startCall = function (params, callback) {
            var startCallData = {
                chatMessageVOType: chatMessageVOTypes.CALL_REQUEST,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            }, content = {
                creatorClientDto: {}
            };

            if (params) {
                if (typeof params.type === 'string' && callTypes.hasOwnProperty(params.type.toUpperCase())) {
                    content.type = callTypes[params.type.toUpperCase()];
                } else {
                    content.type = 0x0; // Defaults to AUDIO Call
                }

                //TODO: Check for mute
                content.creatorClientDto.mute = (params.mute && typeof params.mute === 'boolean') ? params.mute : false;
                content.mute = (params.mute && typeof params.mute === 'boolean') ? params.mute : false;

                if (params.clientType
                    && typeof params.clientType === 'string'
                    && callClientTypes[params.clientType.toUpperCase()] > 0) {
                    content.creatorClientDto.clientType = callClientTypes[params.clientType.toUpperCase()];
                } else {
                    content.creatorClientDto.clientType = callClientType.WEB;
                }

                if (typeof +params.threadId === 'number' && +params.threadId > 0) {
                    content.threadId = +params.threadId;
                } else {
                    if (Array.isArray(params.invitees)) {
                        content.invitees = [];
                        for (var i = 0; i < params.invitees.length; i++) {
                            var tempInvitee = formatDataToMakeInvitee(params.invitees[i]);
                            if (tempInvitee) {
                                content.invitees.push(tempInvitee);
                            }
                        }
                    } else {
                        chatEvents.fireEvent('error', {
                            code: 999,
                            message: 'Invitees list is empty! Send an array of invitees to start a call with, Or send a Thread Id to start a call with current participants'
                        });
                        return;
                    }
                }

                startCallData.content = JSON.stringify(content);
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to start call!'
                });
                return;
            }

            callRequestController.callRequestReceived = true;
            callRequestController.callEstablishedInMySide = true;

            return chatMessaging.sendMessage(startCallData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.startGroupCall = function (params, callback) {
            var startCallData = {
                chatMessageVOType: chatMessageVOTypes.GROUP_CALL_REQUEST,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            }, content = {
                creatorClientDto: {}
            };

            if (params) {
                if (typeof params.type === 'string' && callTypes.hasOwnProperty(params.type.toUpperCase())) {
                    content.type = callTypes[params.type.toUpperCase()];
                } else {
                    content.type = 0x0; // Defaults to AUDIO Call
                }

                content.creatorClientDto.mute = (typeof params.mute === 'boolean') ? params.mute : false;

                if (params.clientType && typeof params.clientType === 'string' && callClientTypes[params.clientType.toUpperCase()] > 0) {
                    content.creatorClientDto.clientType = callClientTypes[params.clientType.toUpperCase()];
                } else {
                    content.creatorClientDto.clientType = callClientType.WEB;
                }

                if (typeof +params.threadId === 'number' && params.threadId > 0) {
                    content.threadId = +params.threadId;
                } else {
                    if (Array.isArray(params.invitees)) {
                        content.invitees = [];
                        for (var i = 0; i < params.invitees.length; i++) {
                            var tempInvitee = formatDataToMakeInvitee(params.invitees[i]);
                            if (tempInvitee) {
                                content.invitees.push(tempInvitee);
                            }
                        }
                    } else {
                        chatEvents.fireEvent('error', {
                            code: 999,
                            message: 'Invitees list is empty! Send an array of invitees to start a call with, Or send a Thread Id to start a call with current participants'
                        });
                        return;
                    }
                }

                startCallData.content = JSON.stringify(content);
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to start call!'
                });
                return;
            }

            return chatMessaging.sendMessage(startCallData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.callReceived = callReceived;

        this.terminateCall = function (params, callback) {
            var terminateCallData = {
                chatMessageVOType: chatMessageVOTypes.TERMINATE_CALL,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            }, content = {};

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    terminateCallData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid call id!'
                    });
                    return;
                }

                terminateCallData.content = JSON.stringify(content);
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to terminate the call!'
                });
                return;
            }

            return chatMessaging.sendMessage(terminateCallData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.acceptCall = function (params, callback) {
            var acceptCallData = {
                chatMessageVOType: chatMessageVOTypes.ACCEPT_CALL,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            }, content = {};

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    acceptCallData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid call id!'
                    });
                    return;
                }

                content.mute = (typeof params.mute === 'boolean') ? params.mute : false;

                content.video = (typeof params.video === 'boolean') ? params.video : false;

                content.videoCall = content.video;

                callRequestController.cameraPaused = (typeof params.cameraPaused === 'boolean') ? params.cameraPaused : callRequestController.cameraPaused;

                if (params.clientType && typeof params.clientType === 'string' && callClientTypes[params.clientType.toUpperCase()] > 0) {
                    content.clientType = callClientTypes[params.clientType.toUpperCase()];
                } else {
                    content.clientType = callClientType.WEB;
                }

                acceptCallData.content = JSON.stringify(content);
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to accept the call!'
                });
                return;
            }
            callRequestController.callEstablishedInMySide = true;
            return chatMessaging.sendMessage(acceptCallData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.rejectCall = this.cancelCall = function (params, callback) {
            var rejectCallData = {
                chatMessageVOType: chatMessageVOTypes.REJECT_CALL,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            };

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    rejectCallData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid call id!'
                    });
                    return;
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to reject the call!'
                });
                return;
            }

            return chatMessaging.sendMessage(rejectCallData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.endCall = endCall;

        this.startRecordingCall = function (params, callback) {
            var recordCallData = {
                chatMessageVOType: chatMessageVOTypes.RECORD_CALL,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token,
                content: {}
            };

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    recordCallData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid Call id!'
                    });
                    return;
                }

                if(params.destinated === true) {
                    recordCallData.chatMessageVOType = chatMessageVOTypes.DESTINATED_RECORD_CALL;
                    recordCallData.content.recordType = typeof +params.recordType === 'number' ? params.recordType : 1;
                    recordCallData.content.tags = Array.isArray(params.tags) ? params.tags : null;
                    recordCallData.content.threadId = typeof +params.threadId === 'number' ? params.threadId : null;
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to Record call!'
                });
                return;
            }

            return chatMessaging.sendMessage(recordCallData, {
                onResult: function (result) {
                    restartMedia(callTopics['sendVideoTopic']);
                    callback && callback(result);
                }
            });
        };

        this.stopRecordingCall = function (params, callback) {
            var stopRecordingCallData = {
                chatMessageVOType: chatMessageVOTypes.END_RECORD_CALL,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            };

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    stopRecordingCallData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid Call id!'
                    });
                    return;
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to Stop Recording the call!'
                });
                return;
            }

            return chatMessaging.sendMessage(stopRecordingCallData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.startScreenShare = function (params, callback) {
            var sendData = {
                chatMessageVOType: chatMessageVOTypes.START_SCREEN_SHARE,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            };

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    sendData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid Call id!'
                    });
                    return;
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to Share Screen!'
                });
                return;
            }

            if(screenShareState.started) {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: "ScreenShare has already started"
                });
                console.log("ScreenShare has already started");
                return
            }

            return chatMessaging.sendMessage(sendData, {
                onResult: function (result) {
                    consoleLogging && console.log("[sdk][startScreenShare][onResult]: ", result);
                    if(!result.hasError) {
                        var direction = 'send', shareScreen = true;
                        if(screenShareState.started && !screenShareState.imOwner) {
                            direction = 'receive';
                            shareScreen = false;
                        }
                        callStateController.addScreenShareToCall(direction, shareScreen);
                    }
                    callback && callback(result);
                }
            });
        };

        this.endScreenShare = function (params, callback) {
            var sendData = {
                chatMessageVOType: chatMessageVOTypes.END_SCREEN_SHARE,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            };

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    sendData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid Call id!'
                    });
                    return;
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to End Screen Sharing!'
                });
                return;
            }

            if(!screenShareState.imOwner) {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'You can not end others screen sharing!'
                });
                return;
            }

            if(!callUsers['screenShare'].peers[callUsers['screenShare'].videoTopicName]) {
                consoleLogging && console.log('[SDK][endScreenShare] No screenShare connection available');
            } else {
                callStateController.removeScreenShareFromCall();
            }

            return chatMessaging.sendMessage(sendData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.getCallsList = function (params, callback) {
            var getCallListData = {
                chatMessageVOType: chatMessageVOTypes.GET_CALLS,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            }, content = {};

            if (params) {
                if (typeof params.count === 'number' && params.count >= 0) {
                    content.count = +params.count;
                } else {
                    content.count = 50;
                }

                if (typeof params.offset === 'number' && params.offset >= 0) {
                    content.offset = +params.offset;
                } else {
                    content.offset = 0;
                }

                if (typeof params.creatorCoreUserId === 'number' && params.creatorCoreUserId > 0) {
                    content.creatorCoreUserId = +params.creatorCoreUserId;
                }

                if (typeof params.creatorSsoId === 'number' && params.creatorSsoId > 0) {
                    content.creatorSsoId = +params.creatorSsoId;
                }

                if (typeof params.name === 'string') {
                    content.name = params.name;
                }

                if (typeof params.type === 'string' && callTypes.hasOwnProperty(params.type.toUpperCase())) {
                    content.type = callTypes[params.type.toUpperCase()];
                }

                if (Array.isArray(params.callIds)) {
                    content.callIds = params.callIds;
                }

                if (typeof params.contactType === 'string') {
                    content.contactType = params.contactType;
                }

                if (typeof params.uniqueId === 'string') {
                    content.uniqueId = params.uniqueId;
                }

                getCallListData.content = JSON.stringify(content);
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to End the call!'
                });
                return;
            }

            return chatMessaging.sendMessage(getCallListData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.deleteFromCallList = function (params, callback) {
            var sendData = {
                chatMessageVOType: chatMessageVOTypes.DELETE_FROM_CALL_HISTORY,
                typeCode: params.typeCode,
                content: []
            };

            if (params) {
                if (typeof params.contactType === 'string' && params.contactType.length) {
                    sendData.content.contactType = params.contactType;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'You should enter a contactType!'
                    });
                    return;
                }

                if (Array.isArray(params.callIds)) {
                    sendData.content = params.callIds;
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to Delete a call from Call History!'
                });
                return;
            }

            return chatMessaging.sendMessage(sendData, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };
                    if (!returnData.hasError) {
                        var messageContent = result.result;
                        returnData.result = messageContent;
                    }
                    callback && callback(returnData);
                }
            });
        };

        this.getCallParticipants = function (params, callback) {
            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.ACTIVE_CALL_PARTICIPANTS,
                typeCode: params.typeCode,
                content: {}
            };

            if (params) {
                if (isNaN(params.callId)) {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Call Id should be a valid number!'
                    });
                    return;
                } else {
                    var callId = +params.callId;
                    sendMessageParams.subjectId = callId;

                    var offset = (parseInt(params.offset) > 0)
                        ? parseInt(params.offset)
                        : 0,
                        count = (parseInt(params.count) > 0)
                            ? parseInt(params.count)
                            : config.getHistoryCount;

                    sendMessageParams.content.count = count;
                    sendMessageParams.content.offset = offset;

                    return chatMessaging.sendMessage(sendMessageParams, {
                        onResult: function (result) {
                            var returnData = {
                                hasError: result.hasError,
                                cache: false,
                                errorMessage: result.errorMessage,
                                errorCode: result.errorCode
                            };

                            if (!returnData.hasError) {
                                var messageContent = result.result,
                                    messageLength = messageContent.length,
                                    resultData = {
                                        participants: reformatCallParticipants(messageContent),
                                        contentCount: result.contentCount,
                                        hasNext: (sendMessageParams.content.offset + sendMessageParams.content.count < result.contentCount && messageLength > 0),
                                        nextOffset: sendMessageParams.content.offset * 1 + messageLength * 1
                                    };

                                returnData.result = resultData;
                            }

                            callback && callback(returnData);
                            /**
                             * Delete callback so if server pushes response before
                             * cache, cache won't send data again
                             */
                            callback = undefined;

                            if (!returnData.hasError) {
                                chatEvents.fireEvent('callEvents', {
                                    type: 'CALL_PARTICIPANTS_LIST_CHANGE',
                                    threadId: callId,
                                    result: returnData.result
                                });
                            }
                        }
                    });
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to Get Call Participants!'
                });
                return;
            }
        };

        this.addCallParticipants = function (params, callback) {
            /**
             * + AddCallParticipantsRequest     {object}
             *    - subjectId                   {int}
             *    + content                     {list} List of CONTACT IDs or inviteeVO Objects
             *    - uniqueId                    {string}
             */

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.ADD_CALL_PARTICIPANT,
                typeCode: params.typeCode,
                content: []
            };

            if (params) {
                if (typeof params.callId === 'number' && params.callId > 0) {
                    sendMessageParams.subjectId = params.callId;
                }

                if (Array.isArray(params.contactIds)) {
                    sendMessageParams.content = params.contactIds;
                }

                if (Array.isArray(params.usernames)) {
                    sendMessageParams.content = [];
                    for (var i = 0; i < params.usernames.length; i++) {
                        sendMessageParams.content.push({
                            id: params.usernames[i],
                            idType: inviteeVOidTypes.TO_BE_USER_USERNAME
                        });
                    }
                }

                if (Array.isArray(params.coreUserids)) {
                    sendMessageParams.content = [];
                    for (var i = 0; i < params.coreUserids.length; i++) {
                        sendMessageParams.content.push({
                            id: params.coreUserids[i],
                            idType: inviteeVOidTypes.TO_BE_CORE_USER_ID
                        });
                    }
                }
            }

            return chatMessaging.sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };
                    if (!returnData.hasError) {
                        // TODO : What is the result?!
                        var messageContent = result.result;
                        returnData.result = messageContent;
                    }
                    callback && callback(returnData);
                }
            });
        };

        this.removeCallParticipants = function (params, callback) {
            /**
             * + removeCallParticipantsRequest     {object}
             *    - subjectId                   {int}
             *    + content                     {list} List of Participants UserIds
             */

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.REMOVE_CALL_PARTICIPANT,
                typeCode: params.typeCode,
                content: []
            };

            if (params) {
                if (typeof params.callId === 'number' && params.callId > 0) {
                    sendMessageParams.subjectId = params.callId;
                }

                if (Array.isArray(params.userIds)) {
                    sendMessageParams.content = params.userIds;
                }
            }

            return chatMessaging.sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };
                    if (!returnData.hasError) {
                        // TODO : What is the result?!
                        var messageContent = result.result;
                        returnData.result = messageContent;
                    }
                    callback && callback(returnData);
                }
            });
        };

        this.muteCallParticipants = function (params, callback) {
            /**
             * + muteCallParticipantsRequest     {object}
             *    - subjectId                   {int}
             *    + content                     {list} List of Participants UserIds
             */

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.MUTE_CALL_PARTICIPANT,
                typeCode: params.typeCode,
                content: []
            };

            if (params) {
                if (typeof params.callId === 'number' && params.callId > 0) {
                    sendMessageParams.subjectId = params.callId;
                }

                if (Array.isArray(params.userIds)) {
                    sendMessageParams.content = params.userIds;
                }
            }

            return chatMessaging.sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };
                    if (!returnData.hasError) {
                        // TODO : What is the result?!
                        var messageContent = result.result;
                        returnData.result = messageContent;
                    }
                    callback && callback(returnData);
                }
            });
        };

        this.unMuteCallParticipants = function (params, callback) {
            /**
             * + unMuteCallParticipantsRequest     {object}
             *    - subjectId                   {int}
             *    + content                     {list} List of Participants UserIds
             */

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.UNMUTE_CALL_PARTICIPANT,
                typeCode: params.typeCode,
                content: []
            };

            if (params) {
                if (typeof params.callId === 'number' && params.callId > 0) {
                    sendMessageParams.subjectId = params.callId;
                }

                if (Array.isArray(params.userIds)) {
                    sendMessageParams.content = params.userIds;
                }
            }

            return chatMessaging.sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };
                    if (!returnData.hasError) {
                        // TODO : What is the result?!
                        var messageContent = result.result;
                        returnData.result = messageContent;
                    }
                    callback && callback(returnData);
                }
            });
        };

        this.turnOnVideoCall = function (params, callback) {
            var turnOnVideoData = {
                chatMessageVOType: chatMessageVOTypes.TURN_ON_VIDEO_CALL,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            };

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    turnOnVideoData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid call id!'
                    });
                    return;
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to turn on the video call!'
                });
                return;
            }

            return chatMessaging.sendMessage(turnOnVideoData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.turnOffVideoCall = function (params, callback) {
            var turnOffVideoData = {
                chatMessageVOType: chatMessageVOTypes.TURN_OFF_VIDEO_CALL,
                typeCode: params.typeCode,
                pushMsgType: 3,
                token: token
            };

            if (params) {
                if (typeof +params.callId === 'number' && params.callId > 0) {
                    turnOffVideoData.subjectId = +params.callId;
                } else {
                    chatEvents.fireEvent('error', {
                        code: 999,
                        message: 'Invalid call id!'
                    });
                    return;
                }
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to turn off the video call!'
                });
                return;
            }

            return chatMessaging.sendMessage(turnOffVideoData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        /**
         * Pauses camera-send without closing its topic
         * @param params
         * @param callback
         */
        this.pauseCamera = function (params, callback) {
            var me = callUsers[chatMessaging.userInfo.id];

            if(!Object.keys(callUsers).length || !me.videoTopicName || !me.peers[me.videoTopicName])
                return;

            me.peers[me.videoTopicName].getLocalStream().getTracks()[0].enabled = false;
            callback && callback();
        };

        this.resumeCamera = function (params, callback) {
            var me = callUsers[chatMessaging.userInfo.id]
            if(!Object.keys(callUsers).length || !me.videoTopicName || !me.peers[me.videoTopicName])
                return;

            me.peers[me.videoTopicName].getLocalStream().getTracks()[0].enabled = true;
            callback && callback();
        };

        /**
         * Pauses mice-send without closing its topic
         * @param params
         * @param callback
         */
        this.pauseMice = function (params, callback) {
            var me = callUsers[chatMessaging.userInfo.id];
            if(!Object.keys(callUsers).length || !me.audioTopicName || !me.peers[me.audioTopicName])
                return;

            me.peers[me.audioTopicName].getLocalStream().getTracks()[0].enabled = false;
            callback && callback();
        };

        this.resumeMice = function (params, callback) {
            var me = callUsers[chatMessaging.userInfo.id];
            if(!Object.keys(callUsers).length || !me.audioTopicName || !me.peers[me.audioTopicName])
                return;

            me.peers[me.audioTopicName].getLocalStream().getTracks()[0].enabled = true;
            callback && callback();
        };

        this.resizeCallVideo = function (params, callback) {
            if (params) {
                if (!!params.width && +params.width > 0) {
                    callVideoMinWidth = +params.width;
                }

                if (!!params.height && +params.height > 0) {
                    callVideoMinHeight = +params.height;
                }

                if(!callUsers[chatMessaging.userInfo.id]){
                    consoleLogging && console.log("Error in resizeCallVideo(), call not started ");
                    return;
                }

                var userObject = callUsers[chatMessaging.userInfo.id]
                userObject.peers[userObject.videoTopicName].getLocalStream().getTracks()[0].applyConstraints({
                    "width": callVideoMinWidth,
                    "height": callVideoMinHeight
                })
                    .then((res) => {
                        userObject.htmlElements[userObject.videoTopicName].style.width = callVideoMinWidth + 'px';
                        userObject.htmlElements[userObject.videoTopicName].style.height = callVideoMinHeight + 'px';
                        callback && callback();
                    })
                    .catch((e) => {
                        chatEvents.fireEvent('error', {
                            code: 999,
                            message: e
                        });
                    });
            } else {
                chatEvents.fireEvent('error', {
                    code: 999,
                    message: 'No params have been sent to resize the video call! Send an object like {width: 640, height: 480}'
                });
                return;
            }
        };

        this.callStop = callStop;

        this.restartMedia = restartMedia;
    }

    if (typeof module !== 'undefined' && typeof module.exports != 'undefined') {
        module.exports = ChatCall;
    } else {
        if (!window.POD) {
            window.POD = {};
        }
        window.POD.ChatCall = ChatCall;
    }
})();
