import React, {useEffect, useState} from "react";
import axios from "axios";

interface Device {
    alias: string;
    device_id: number;
    pos: {
        dir?: number;
        s?: number;
        sat_qty?: number;
        ts: number;
        x: number;
        y: number;
    },
    status: number;
}

const devices: Device[] = [
    {
        "alias": "kg223abМирлан",
        "device_id": 861292054335519,
        "pos": {
            "sat_qty": 5,
            "ts": 1763227243,
            "x": 42.854988,
            "y": 74.434403
        },
        "status": 1
    },
    {
        "alias": "08kg 221 Акрам",
        "device_id": 861292057006307,
        "pos": {
            "sat_qty": 7,
            "ts": 1763227437,
            "x": 42.853733,
            "y": 74.438265
        },
        "status": 1
    },
    {
        "alias": "sprinter3044Николай",
        "device_id": 867994065206217,
        "pos": {
            "sat_qty": 3,
            "ts": 1763226962,
            "x": 42.855423,
            "y": 74.43469
        },
        "status": 1
    },
    {
        "alias": "823AFВиктор",
        "device_id": 865167045395937,
        "pos": {
            "dir": 141,
            "ts": 1763214252,
            "x": 42.854948,
            "y": 74.435487
        },
        "status": 1
    },
    {
        "alias": "971af Мурат(Бойко)",
        "device_id": 865167045412310,
        "pos": {
            "dir": 181,
            "ts": 1763208804,
            "x": 42.855528,
            "y": 74.434583
        },
        "status": 1
    },
    {
        "alias": "975af Азиз",
        "device_id": 865167045443422,
        "pos": {
            "dir": 334,
            "s": 1,
            "sat_qty": 8,
            "ts": 1763207419,
            "x": 42.854898,
            "y": 74.433938
        },
        "status": 1
    },
    {
        "alias": "825AF Дмитрий",
        "device_id": 860665057831157,
        "pos": {
            "sat_qty": 9,
            "ts": 1763227649,
            "x": 42.855516,
            "y": 74.434676
        },
        "status": 1
    },
    {
        "alias": "08kg018ad Рысбек",
        "device_id": 861292054372611,
        "pos": {
            "dir": 280,
            "s": 1,
            "sat_qty": 10,
            "ts": 1763205979,
            "x": 42.855655,
            "y": 74.434285
        },
        "status": 2
    },
    {
        "alias": "08Kg742AF Айбек",
        "device_id": 865167045400067,
        "pos": {
            "dir": 143,
            "ts": 1763209334,
            "x": 42.85638,
            "y": 74.434683
        },
        "status": 1
    }
];

export const useNewPositionForm = () => {
    const [selectValue, setSelectValue] = useState<string>("0");
    const [inputValue, setInputValue] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [posInfo, setPosInfo] = useState("");

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 250);
    }

    const selectedDevicePos = devices[parseInt(selectValue)].pos;

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${selectedDevicePos.x}&longitude=${selectedDevicePos.y}&localityLanguage=ru`);
                setPosInfo(response.data?.city);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [selectedDevicePos.x, selectedDevicePos.y]);

    return {
        selectValue,
        inputValue,
        loading,
        devices,
        selectedDevicePos,
        handleSubmit,
        setSelectValue,
        setInputValue,
        posInfo,
    }
}