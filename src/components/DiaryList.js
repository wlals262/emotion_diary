import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "./MyButton";
import DiaryItem from "./DiaryItem";

const sortOptionList = [
    {value:"latest", name:"최신순"},
    {value:"oldest", name:"오래된 순"},
];

const filterOptionList = [
    {value:"all", name:"전부다"},
    {value:"good", name:"좋은 감정만"},
    {value:"bad", name:"안좋은 감정만"},
]

const ControlMenu = ({value, onChange, optionList}) => { //정렬을 위한 select 메뉴
    return (
        <select className="ControlMenu" value = {value} onChange={(e) => onChange(e.target.value)}>
            {optionList.map((it,idx) => (
                <option key={idx} value={it.value}>
                    {it.name}
                </option>
            ))}
        </select>
    );
};

const DiaryList = ({diaryList}) => {
    const navigate = useNavigate();
    const [sortType, setSortType] = useState('latest'); //정렬값 저장 state
    const [filter,setFilter] = useState("all"); //감정필터링

    const getProcessedDiaryList = () => { //정렬할때 sort를 쓰면 원본 데이터가 날아가므로 깊은 복사로 새로운 곳에 data 저장해서 사용
        
        const filterCallBack = (item) => { 
            if(filter === "good"){ //good일 경우 item의 감정이 3 이하일 경우만 출력
                return parseInt(item.emotion) <= 3;
            } else {
                return parseInt(item.emotion) > 3;
            }
        };

        const compare = (a,b) => { //객체로 반환받기 때문에 정렬하기 위해선 정렬 함수를 만들어야 함
            if(sortType==="latest"){
                return parseInt(b.date) - parseInt(a.date);
            } else {
                return parseInt(a.date) - parseInt(b.date);
            }
        };

        const copyList = JSON.parse(JSON.stringify(diaryList));

        const filteredList = 
            filter === 'all' ? copyList : copyList.filter((it) => filterCallBack(it)); //'전부다'라면 전부 출력 , 그게 아니라면 filter로 emotion을 분리
        //이때 filter를 지정하기 힘드니 따로 filterCallBack 변수를 만들어 거기서 필터링 수행
        const sortedList = filteredList.sort(compare);
        return sortedList;
    }

    return (
        <div className="DiaryList">

        <div className="menu_wrapper">
            <div className="left_col">
                <ControlMenu value={sortType} onChange={setSortType} optionList={sortOptionList}/>
                <ControlMenu value={filter} onChange={setFilter} optionList={filterOptionList}/>
            </div>
            <div className="right_col">
                <MyButton type={'positive'} text={'새 일기쓰기'} onClick={() => navigate('/new')} /> 
            </div>
        </div>
            {getProcessedDiaryList().map((it) => (
                <DiaryItem key={it.id} {...it} />
            ))}
        </div>
    )
}

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;