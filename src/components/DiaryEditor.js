import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { DiaryDispatchContext } from "../App";

import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import EmotionItem from "./Emotionitem";

const env = process.env;
env.PUBLIC_URL = env.PUBLIC_URL || "";

const emotionList = [
    {
        emotion_id:1,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion1.png`,
        emotion_descript: '완전좋음'
    },
    {
        emotion_id:2,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion2.png`,
        emotion_descript: '좋음'
    },
    {
        emotion_id:3,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion3.png`,
        emotion_descript: '그럭저럭'
    },
    {
        emotion_id:4,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion4.png`,
        emotion_descript: '나쁨'
    },
    {
        emotion_id:5,
        emotion_img : process.env.PUBLIC_URL + `/assets/emotion5.png`,
        emotion_descript: '끔찍함'
    },
];

const getStringDate = (date) => {
    return date.toISOString().slice(0, 10);
};

const DiaryEditor = ({isEdit, originData}) => {

    const contentRef = useRef();
    const [content, setContent] = useState("");
    const [emotion, setEmotion] = useState(3);
    const [date, setDate] = useState(getStringDate(new Date()));

    const handleClickEmote = (emotion) => {
        setEmotion(emotion);
    }

    const navigate = useNavigate();
    const {onCreate, onEdit} = useContext(DiaryDispatchContext); //기존에 만들었던 provider의 onCreate함수를 사용한다.

    const handleSubmit = () => {
        if(content.length < 1){
            contentRef.current.focus(); //아무것도 안썼으면 focus 시킨 후 return
            return;
        }

        if(window.confirm(isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?" )){
            if(!isEdit){ //새로운 일기 생성 시
                onCreate(date, content, emotion);
            } else{ // 일기 수정 시
                onEdit(originData.id, date, content, emotion);
            }
        }

        navigate('/',{replace:true}); //home으로 돌아가는데 뒤로가기로 일기작성페이지로 다시 못오게 막아야한다.
    }

    useEffect(() => { //프롭으로 isEdit과 originData를 준 경우(Edit.js에서 보낸경우)만 해당되어 코드 실행
        if(isEdit) {
            setDate(getStringDate(new Date(parseInt(originData.date))));
            setEmotion(originData.emotion);
            setContent(originData.content);
        }
    }, [isEdit, originData])

    return (
        <div className="DiaryEditor">
            <MyHeader 
                headText={isEdit ? "일기 수정하기" :"새 일기쓰기" }
                leftChild={<MyButton text={"< 뒤로가기"} onClick={() => navigate(-1)}/>}
            />
            <div>
                {/* 날짜 선택 */}
                <section>
                    <h4>오늘은 언제인가요?</h4>
                    <div className="input_box">
                        <input 
                            className="input_date"
                            value={date}
                            onChange={(e)=> setDate(e.target.value)}
                            type="date" 
                        />
                    </div>
                </section>
                {/* 이모션 */}
                <section>
                    <h4>오늘의 감정</h4>
                    <div className="input_box emotion_list_wrapper">
                        {emotionList.map((it) => 
                            <EmotionItem key={it.emotion_id} {...it} 
                            onClick={handleClickEmote}
                            isSelected={it.emotion_id === emotion}
                        />)}
                    </div>
                </section>
                {/* 일기작성 섹션 */}
                <section>
                    <h4>오늘의 일기</h4>
                    <div className="input_box text_wrapper">
                        <textarea 
                            placeholder="오늘은 어땟나요"
                            ref={contentRef} 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </section>
                {/* 저장/취소 버튼 */}
                <section>
                    <div className="control_box">
                        <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
                        <MyButton text={"저장하기"} type={"positive"} onClick={handleSubmit}/>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DiaryEditor;