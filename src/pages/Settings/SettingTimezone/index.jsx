import Setting from "components/Setting";
import Input from "components/UI/Input";
import SelectMenu from "components/UI/SelectMenu";
import catchAsync from "utils/CatchAsync";
import { useTimezonesQuery } from "hooks/useDetailsData";
import { useEffect, useState } from "react";
import Button from "components/UI/Button";
import "assets/css/flag-icons.min.css";
import { useQueryClient } from "react-query";
import { useUpdateSettingsQuery } from "hooks/useAuth";
import "./settingTimezone.scss";

const SettingTimezone = () => {
    const queryClient = useQueryClient();
    const { timezone: userTimezone } = queryClient.getQueryData("user");
    const { mutateAsync: updateSettings } = useUpdateSettingsQuery();

    const { data: timezones } = useTimezonesQuery();
    const [selectedTimezone, setSelectedTimezone] = useState(null);

    useEffect(() => {
        if (timezones) {
            setSelectedTimezone(timezones.find((timezone) => timezone.id === userTimezone));
        }
    }, [timezones]);


    const updateTimezone = catchAsync(
        async () => {
            await updateSettings({ properties: { timezone: selectedTimezone.id } });
        },
        {
            onLoad: "Updating timezone",
            onSuccess: "Timezone updated",
            onError: "Updating timezone failed",
        }
    );

    const customButtonIcon = () => {
        if (selectedTimezone) {
            if (selectedTimezone.hasOwnProperty("code")) {
                return `fi fi-${selectedTimezone.code.toLowerCase()}`;
            } else {
                return "far fa-circle-question";
            }
        }
        return "far fa-circle-question";
    };

    return (
        <Setting title="Timezone" iconClass="far fa-clock">
            <div className="setting-timezone">
                <div className="timezones-list">
                    {timezones && (
                        <SelectMenu
                            activeOption={selectedTimezone}
                            type="selectable-options"
                            options={timezones
                                .filter((timezone) => timezone.hasOwnProperty("code"))
                                .map((timezone) => {
                                    return {
                                        iconClass: `fi fi-${timezone.code.toLowerCase()} fis`,
                                        text: timezone.code,
                                        value: timezone,
                                    };
                                }).sort((a,b) => {
                                    if(a.text < b.text) return -1;
                                    if(a.text > b.text) return 1;
                                    return 0;
                                })}
                            setActiveOption={setSelectedTimezone}
                            customButtonIcon={customButtonIcon()}
                        />
                    )}
                </div>

                <span className="selected-timezone-name">
                    {selectedTimezone ? selectedTimezone.timezone : "No timezone selected"}
                </span>

                <Button iconClass="far fa-save" text="Update" onClick={updateTimezone} />
            </div>
        </Setting>
    );
};

export default SettingTimezone;
