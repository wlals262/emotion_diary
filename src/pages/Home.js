import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";

import MyHeader from './../components/MyHeader';
import MyButton from './../components/MyButton';
import DiaryList from './../components/DiaryList';

const Home = () => {

    const diaryList  = useContext(DiaryStateContext);

    const [data,setData] = useState([]);
    const [curDate, setCurDate] = useState(new Date());   
    const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

    useEffect(() => { //현재 년도와 월에 해당하는 일기만 뽑아야 함
        if(diaryList.length >= 1){ // 처리가 오래걸리므로 다이어리 리스트가 1이상일때만 진행
            const firstDay = new Date( //이번년도 이번 월의 1일
                curDate.getFullYear(),
                curDate.getMonth(),
                1
            ).getTime();

            const lastDay = new Date( //이번년도 다음달의 0 이므로 이번달의 마지막일
                curDate.getFullYear(),
                curDate.getMonth() + 1,
                0
            ).getTime();

            setData(diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay)); //시작할때와 끝날때 사이
        }
    },[diaryList, curDate]); //일기 수정 시 , 현재 날짜 커서를 다음달이나 이전달로 넘겼을 때 리렌더

    useEffect(() => {
        console.log(data);
    }, [data]);

    const increaseMonth = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth()+1, curDate.getDate())); //현재 년도 , 월에 +1 , 현재 일
    };
    const decreaseMonth = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth()-1, curDate.getDate()));
    };

    return (
        <div>
            <MyHeader headText={headText}
            leftChild={<MyButton text={'<'} onClick={decreaseMonth} />} 
            rightChild={<MyButton text={'>'} onClick={increaseMonth} />} 
            />
            <DiaryList diaryList={data} />
        </div>
    );
};

export default Home;