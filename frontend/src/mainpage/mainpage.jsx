import './main.css';
import config from '../../config.json';
import { useEffect, useState } from "react";


async function get_cars(mark, model) {
    const response = await fetch(`${config.protocol}://${config.ip}/catalog/get_cars`, {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mark: mark,
            model: model
        })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    return data;
}


async function get_all_marks_and_models() {
    const response = await fetch(`${config.protocol}://${config.ip}/catalog/get_all_marks_and_models`, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

export default function Mainpage() {
    const [marksModels, setMarksModels] = useState({});
    const [selectedMark, setSelectedMark] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [models, setModels] = useState([]);

    const carsPerPage = 20;


    useEffect(() => {
        get_all_marks_and_models().then(data => {
            setMarksModels(data);
            const firstMark = Object.keys(data)[0];
            setSelectedMark(firstMark);
            setModels(data[firstMark]);
            setSelectedModel(data[firstMark][0]);
        });
    }, []);


    useEffect(() => {
        if (selectedMark && selectedModel) {
            get_cars(selectedMark, selectedModel).then(data => {
                setCars(data);
                setCurrentPage(1);
            });
        }
    }, [selectedMark, selectedModel]);

    useEffect(() => {
        if (selectedMark && marksModels[selectedMark]) {
            setModels(marksModels[selectedMark]);
            setSelectedModel(marksModels[selectedMark][0]);
        }
    }, [selectedMark, marksModels]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    const handleMarkChange = (event) => {
        setSelectedMark(event.target.value);
    };

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    const totalPages = Math.ceil(cars.length / carsPerPage);

    return (
        <>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Автомобили</title>
                <link rel="stylesheet" href="styles.css" />
            </head>
            <body>
            <div className="container">
                <header>
                    <ul className="brands">
                        {Object.keys(marksModels).sort().map((mark) => (
                            <li key={mark}>
                                <a
                                    href="#"
                                    onClick={() => setSelectedMark(mark)}
                                    className={selectedMark === mark ? 'active' : ''}
                                >
                                    {mark}
                                </a>
                                <span>{marksModels[mark].length}</span>
                            </li>
                        ))}
                    </ul>
                </header>

                <section className="filters">
                    <label htmlFor="model-select">Модель:</label>
                    <select id="model-select" value={selectedModel} onChange={handleModelChange}>
                        {models.sort().map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </section>

                <table>
                    <thead>
                    <tr className="table_header">
                        <th>ID</th>
                        <th>Марка/модель</th>
                        <th>Модификация</th>
                        <th>Комплектация</th>
                        <th>Стоимость</th>
                        <th>Дата создания</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentCars.map((car) => (
                        <tr key={car._id}>
                            <td>{car._id}</td>
                            <td>{car.mark} {car.model}</td>
                            <td>
                                {`${car.engine.volume.toFixed(1)} ${car.engine.transmission} (${car.engine.power} л.с.)`}
                                {car.drive ? ` ${car.drive}` : ''}
                            </td>
                            <td>{car.equipmentName === "ПустаяКомплектация" ? "-" : car.equipmentName}</td>
                            <td>{car.price.toLocaleString().replace(/,/g, " ")} ₽</td>
                            <td>{new Date(car.createdAt).toLocaleString('ru-RU', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                                second: undefined
                            }).replace(",", " ")}</td>


                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="pagination">
                    <a href="#" className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                       onClick={() => handlePageChange(currentPage - 1)}>&laquo;</a>
                    {[...Array(totalPages).keys()].map(page => (
                        <a href="#" key={page + 1} className={currentPage === page + 1 ? 'active' : ''}
                           onClick={() => handlePageChange(page + 1)}>{page + 1}</a>
                    ))}
                    <a href="#" className={`next ${currentPage === totalPages ? 'disabled' : ''}`}
                       onClick={() => handlePageChange(currentPage + 1)}>&raquo;</a>
                </div>
            </div>
            </body>
        </>
    );
}
