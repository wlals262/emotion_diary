import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {
    const [originData, setOriginData] = useState();
    const navigate = useNavigate();
    const { id } = useParams();

    const diaryList = useContext(DiaryStateContext);

    useEffect(() => {
        if(diaryList.length >= 1){
            const targetDiary = diaryList.find((it) => parseInt(it.id) === parseInt(id));

            if (targetDiary) { //id가 있는경우(일기장이 있는 경우)는 그냥 출력, 없는 경우 홈으로 이동시킴
                setOriginData(targetDiary);
            } else {
                alert("없는 일기입니다.");
                navigate('/',{replace: true});
            }
        }
    }, [id, diaryList]) //id나 diaryList가 변할때만 리렌더

    return (
        <div>
            {originData && <DiaryEditor isEdit = {true} originData={originData} />}
        </div>
    );
};

export default Edit;