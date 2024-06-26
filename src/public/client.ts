import express, { Express, Request, Response } from "express";

console.log("Client-side code is running.")

const increaseButton: HTMLElement | null = document.getElementById("increaseButton");
const decreaseButton: HTMLElement | null = document.getElementById("decreaseButton");
const startNumber: HTMLElement | null = document.getElementById("countNumber");
const continuousIncreaseCheck = <HTMLInputElement>document.getElementById("continuousIncreaseCheck");

async function loadNumber(): Promise<void> {
    await fetch('/getNumber', { method: 'GET' })
        .then(async function (response) {
            if (response.ok) {
                await response.json()
                    .then(function (data) {
                        console.log(data);
                        if (startNumber) startNumber.innerHTML = data;
                    });
                return;
            }
            throw new Error("Request failed.");
        })
        .catch(function (error) {
            console.log(error);
        });
}

window.onload = loadNumber;

async function increaseClick() : Promise<void> {
    console.log("Increase button is clicked!");
        await fetch('/increased', { method: 'PUT' })
            .then(function (response) {
                if (response.ok) {
                    console.log("Increase recorded!");
                    loadNumber();
                    return;
                }
                throw new Error("Request failed.");
            })
            .catch(function (error) {
                console.log(error);
            });
}

async function decreaseClick() : Promise<void> {
    console.log("Decrease button is clicked!");
        await fetch("/decreased", { method: "PUT" })
            .then(function (response) {
                if (response.ok) {
                    console.log("Decrease recorded!");
                    loadNumber();
                    return;
                }
                throw new Error("Request failed.");
            })
            .catch(function (error) {
                console.log(error);
            });
}

let id : ReturnType<typeof setInterval>;
async function ContinuousIncrease(e: Event){
    const isChecked = (<HTMLInputElement>e.target).checked;
    if(isChecked){
        id = setInterval(async () => {
            await increaseClick();
        }, 1000)
    }
    else if (!isChecked){
        clearInterval(id);
    }
}

if (increaseButton) {
    increaseButton.addEventListener('click', increaseClick);
}

if (decreaseButton) {
    decreaseButton.addEventListener("click", decreaseClick);
}

if (continuousIncreaseCheck) {
    continuousIncreaseCheck.addEventListener("change", ContinuousIncrease);
}